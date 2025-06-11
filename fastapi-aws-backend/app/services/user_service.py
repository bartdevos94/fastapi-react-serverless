from datetime import datetime
from typing import Dict, List, Optional, Any
from boto3.dynamodb.conditions import Key, Attr

from app.services.dynamodb_service import dynamodb_service
from app.services.auth_service import auth_service
from app.core.config import settings
from app.core.exceptions import UserNotFoundException
from app.utils.cache import lru_ttl_cache, invalidate_cache_pattern


class UserService:
    """User service with DynamoDB and Cognito integration."""
    
    def __init__(self):
        self.table_name = settings.USERS_TABLE_NAME
    
    async def create_user(self, email: str, password: str, 
                         profile_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Create a new user in both Cognito and DynamoDB.
        
        Args:
            email: User email
            password: User password
            profile_data: Additional profile information
            
        Returns:
            Created user data
        """
        # Sign up in Cognito
        cognito_response = await auth_service.sign_up(email, password, profile_data)
        
        # Create user profile in DynamoDB
        user_data = {
            'user_id': cognito_response['UserSub'],
            'email': email,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
            'is_active': True,
            'email_verified': False
        }
        
        if profile_data:
            user_data.update(profile_data)
        
        await dynamodb_service.put_item(self.table_name, user_data)
        
        # Invalidate cache
        await invalidate_cache_pattern(f"user:{cognito_response['UserSub']}")
        
        return user_data
    
    async def confirm_user_email(self, email: str, confirmation_code: str) -> Dict[str, Any]:
        """
        Confirm user email verification.
        
        Args:
            email: User email
            confirmation_code: Verification code
            
        Returns:
            Updated user data
        """
        # Confirm in Cognito
        await auth_service.confirm_sign_up(email, confirmation_code)
        
        # Update user in DynamoDB
        user = await self.get_user_by_email(email)
        if user:
            updated_user = await self.update_user(
                user['user_id'],
                {'email_verified': True}
            )
            return updated_user
        
        raise UserNotFoundException(email)
    
    @lru_ttl_cache(ttl=300)  # Cache for 5 minutes
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user by ID with caching.
        
        Args:
            user_id: User ID
            
        Returns:
            User data or None if not found
        """
        return await dynamodb_service.get_item(
            self.table_name,
            {'user_id': user_id}
        )
    
    @lru_ttl_cache(ttl=300)  # Cache for 5 minutes
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Get user by email with caching.
        
        Args:
            email: User email
            
        Returns:
            User data or None if not found
        """
        # Query by GSI (assuming email is a GSI)
        users = await dynamodb_service.query_items(
            self.table_name,
            Key('email').eq(email),
            limit=1
        )
        
        return users[0] if users else None
    
    async def update_user(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user information.
        
        Args:
            user_id: User ID
            updates: Fields to update
            
        Returns:
            Updated user data
        """
        # Add updated timestamp
        updates['updated_at'] = datetime.utcnow().isoformat()
        
        # Build update expression
        update_expression = "SET "
        expression_attribute_values = {}
        expression_attribute_names = {}
        
        for i, (key, value) in enumerate(updates.items()):
            if i > 0:
                update_expression += ", "
            
            attr_name = f"#attr{i}"
            attr_value = f":val{i}"
            
            update_expression += f"{attr_name} = {attr_value}"
            expression_attribute_names[attr_name] = key
            expression_attribute_values[attr_value] = value
        
        updated_user = await dynamodb_service.update_item(
            self.table_name,
            {'user_id': user_id},
            update_expression,
            expression_attribute_values,
            expression_attribute_names
        )
        
        # Invalidate cache
        await invalidate_cache_pattern(f"user:{user_id}")
        
        return updated_user
    
    async def delete_user(self, user_id: str) -> bool:
        """
        Delete user (soft delete by marking as inactive).
        
        Args:
            user_id: User ID
            
        Returns:
            True if successful
        """
        await self.update_user(user_id, {
            'is_active': False,
            'deleted_at': datetime.utcnow().isoformat()
        })
        
        return True
    
    async def list_users(self, limit: int = 50, last_evaluated_key: str = None) -> Dict[str, Any]:
        """
        List users with pagination.
        
        Args:
            limit: Maximum number of users to return
            last_evaluated_key: Pagination key
            
        Returns:
            List of users and pagination info
        """
        users = await dynamodb_service.scan_table(
            self.table_name,
            filter_expression=Attr('is_active').eq(True),
            limit=limit
        )
        
        return {
            'users': users,
            'count': len(users)
        }
    
    async def authenticate_user(self, email: str, password: str) -> Dict[str, Any]:
        """
        Authenticate user and return tokens.
        
        Args:
            email: User email
            password: User password
            
        Returns:
            Authentication tokens and user data
        """
        # Authenticate with Cognito
        auth_result = await auth_service.sign_in(email, password)
        
        # Get user profile
        user = await self.get_user_by_email(email)
        
        if not user:
            raise UserNotFoundException(email)
        
        return {
            'tokens': auth_result,
            'user': user
        }
    
    async def refresh_user_token(self, refresh_token: str) -> Dict[str, Any]:
        """
        Refresh user access token.
        
        Args:
            refresh_token: Cognito refresh token
            
        Returns:
            New authentication tokens
        """
        return await auth_service.refresh_token(refresh_token)
    
    async def sign_out_user(self, access_token: str) -> bool:
        """
        Sign out user.
        
        Args:
            access_token: Cognito access token
            
        Returns:
            True if successful
        """
        return await auth_service.sign_out(access_token)
    
    async def initiate_password_reset(self, email: str) -> Dict[str, Any]:
        """
        Initiate password reset process.
        
        Args:
            email: User email
            
        Returns:
            Reset initiation response
        """
        return await auth_service.forgot_password(email)
    
    async def confirm_password_reset(self, email: str, confirmation_code: str, 
                                   new_password: str) -> Dict[str, Any]:
        """
        Confirm password reset with new password.
        
        Args:
            email: User email
            confirmation_code: Verification code
            new_password: New password
            
        Returns:
            Confirmation response
        """
        return await auth_service.confirm_forgot_password(
            email, confirmation_code, new_password
        )
    
    async def get_user_stats(self) -> Dict[str, Any]:
        """
        Get user statistics.
        
        Returns:
            User statistics
        """
        # This would typically use more complex aggregation queries
        # For now, we'll do a simple scan
        all_users = await dynamodb_service.scan_table(self.table_name)
        
        active_users = sum(1 for user in all_users if user.get('is_active', False))
        verified_users = sum(1 for user in all_users if user.get('email_verified', False))
        
        return {
            'total_users': len(all_users),
            'active_users': active_users,
            'verified_users': verified_users,
            'inactive_users': len(all_users) - active_users
        }


# Global user service instance
user_service = UserService()