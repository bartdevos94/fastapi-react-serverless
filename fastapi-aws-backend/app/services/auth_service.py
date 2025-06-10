import boto3
import hmac
import hashlib
import base64
from botocore.exceptions import ClientError
from typing import Dict, Any, Optional
import jwt
from jwt import PyJWKClient
import requests

from app.core.config import settings
from app.core.exceptions import AuthenticationException, AuthorizationException
from app.utils.cache import lru_ttl_cache


class CognitoAuthService:
    """AWS Cognito authentication service with caching."""
    
    def __init__(self):
        session = boto3.Session(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.COGNITO_REGION
        )
        self.client = session.client('cognito-idp')
        self.user_pool_id = settings.COGNITO_USER_POOL_ID
        self.client_id = settings.COGNITO_CLIENT_ID
        self.client_secret = settings.COGNITO_CLIENT_SECRET
        
        # JWK client for token verification
        jwks_url = f"https://cognito-idp.{settings.COGNITO_REGION}.amazonaws.com/{self.user_pool_id}/.well-known/jwks.json"
        self.jwks_client = PyJWKClient(jwks_url, cache_ttl=300)
    
    def _calculate_secret_hash(self, username: str) -> str:
        """Calculate secret hash for Cognito operations."""
        if not self.client_secret:
            return None
        
        message = username + self.client_id
        dig = hmac.new(
            self.client_secret.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).digest()
        return base64.b64encode(dig).decode()
    
    async def sign_up(self, email: str, password: str, 
                     attributes: Dict[str, str] = None) -> Dict[str, Any]:
        """
        Register a new user with Cognito.
        
        Args:
            email: User email
            password: User password
            attributes: Additional user attributes
            
        Returns:
            Cognito sign-up response
        """
        try:
            user_attributes = [
                {'Name': 'email', 'Value': email}
            ]
            
            if attributes:
                for key, value in attributes.items():
                    user_attributes.append({'Name': key, 'Value': value})
            
            kwargs = {
                'ClientId': self.client_id,
                'Username': email,
                'Password': password,
                'UserAttributes': user_attributes
            }
            
            if self.client_secret:
                kwargs['SecretHash'] = self._calculate_secret_hash(email)
            
            response = self.client.sign_up(**kwargs)
            return response
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            
            if error_code == 'UsernameExistsException':
                raise AuthenticationException("User already exists")
            elif error_code == 'InvalidPasswordException':
                raise AuthenticationException("Invalid password format")
            else:
                raise AuthenticationException(f"Sign up failed: {error_message}")
    
    async def confirm_sign_up(self, email: str, confirmation_code: str) -> Dict[str, Any]:
        """
        Confirm user sign-up with verification code.
        
        Args:
            email: User email
            confirmation_code: Verification code
            
        Returns:
            Confirmation response
        """
        try:
            kwargs = {
                'ClientId': self.client_id,
                'Username': email,
                'ConfirmationCode': confirmation_code
            }
            
            if self.client_secret:
                kwargs['SecretHash'] = self._calculate_secret_hash(email)
            
            response = self.client.confirm_sign_up(**kwargs)
            return response
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            raise AuthenticationException(f"Confirmation failed: {error_message}")
    
    async def sign_in(self, email: str, password: str) -> Dict[str, Any]:
        """
        Sign in user with email and password.
        
        Args:
            email: User email
            password: User password
            
        Returns:
            Authentication tokens
        """
        try:
            kwargs = {
                'ClientId': self.client_id,
                'AuthFlow': 'USER_PASSWORD_AUTH',
                'AuthParameters': {
                    'USERNAME': email,
                    'PASSWORD': password
                }
            }
            
            if self.client_secret:
                kwargs['AuthParameters']['SECRET_HASH'] = self._calculate_secret_hash(email)
            
            response = self.client.initiate_auth(**kwargs)
            
            if 'ChallengeName' in response:
                # Handle MFA or other challenges
                return {'challenge': response['ChallengeName'], 'session': response['Session']}
            
            return response['AuthenticationResult']
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            
            if error_code in ['NotAuthorizedException', 'UserNotConfirmedException']:
                raise AuthenticationException("Invalid credentials or user not confirmed")
            else:
                raise AuthenticationException(f"Sign in failed: {error_message}")
    
    async def refresh_token(self, refresh_token: str) -> Dict[str, Any]:
        """
        Refresh access token using refresh token.
        
        Args:
            refresh_token: Cognito refresh token
            
        Returns:
            New authentication tokens
        """
        try:
            kwargs = {
                'ClientId': self.client_id,
                'AuthFlow': 'REFRESH_TOKEN_AUTH',
                'AuthParameters': {
                    'REFRESH_TOKEN': refresh_token
                }
            }
            
            if self.client_secret:
                # For refresh token, we don't have username, so use a placeholder
                kwargs['AuthParameters']['SECRET_HASH'] = self._calculate_secret_hash('')
            
            response = self.client.initiate_auth(**kwargs)
            return response['AuthenticationResult']
            
        except ClientError as e:
            error_message = e.response['Error']['Message']
            raise AuthenticationException(f"Token refresh failed: {error_message}")
    
    @lru_ttl_cache(ttl=300)  # Cache for 5 minutes
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify JWT token from Cognito with caching.
        
        Args:
            token: JWT access token
            
        Returns:
            Decoded token payload
        """
        try:
            # Get signing key
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)
            
            # Decode and verify token
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=['RS256'],
                audience=self.client_id,
                issuer=f"https://cognito-idp.{settings.COGNITO_REGION}.amazonaws.com/{self.user_pool_id}"
            )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise AuthenticationException("Token has expired")
        except jwt.InvalidTokenError as e:
            raise AuthenticationException(f"Invalid token: {str(e)}")
    
    async def get_user(self, access_token: str) -> Dict[str, Any]:
        """
        Get user information using access token.
        
        Args:
            access_token: Cognito access token
            
        Returns:
            User information
        """
        try:
            response = self.client.get_user(AccessToken=access_token)
            
            # Convert attributes to dict
            user_data = {
                'username': response['Username'],
                'user_status': response.get('UserStatus'),
                'attributes': {}
            }
            
            for attr in response.get('UserAttributes', []):
                user_data['attributes'][attr['Name']] = attr['Value']
            
            return user_data
            
        except ClientError as e:
            error_message = e.response['Error']['Message']
            raise AuthenticationException(f"Failed to get user: {error_message}")
    
    async def sign_out(self, access_token: str) -> bool:
        """
        Sign out user (revoke tokens).
        
        Args:
            access_token: Cognito access token
            
        Returns:
            True if successful
        """
        try:
            self.client.global_sign_out(AccessToken=access_token)
            return True
            
        except ClientError as e:
            error_message = e.response['Error']['Message']
            raise AuthenticationException(f"Sign out failed: {error_message}")
    
    async def forgot_password(self, email: str) -> Dict[str, Any]:
        """
        Initiate forgot password flow.
        
        Args:
            email: User email
            
        Returns:
            Forgot password response
        """
        try:
            kwargs = {
                'ClientId': self.client_id,
                'Username': email
            }
            
            if self.client_secret:
                kwargs['SecretHash'] = self._calculate_secret_hash(email)
            
            response = self.client.forgot_password(**kwargs)
            return response
            
        except ClientError as e:
            error_message = e.response['Error']['Message']
            raise AuthenticationException(f"Forgot password failed: {error_message}")
    
    async def confirm_forgot_password(self, email: str, confirmation_code: str, 
                                    new_password: str) -> Dict[str, Any]:
        """
        Confirm forgot password with new password.
        
        Args:
            email: User email
            confirmation_code: Verification code
            new_password: New password
            
        Returns:
            Confirmation response
        """
        try:
            kwargs = {
                'ClientId': self.client_id,
                'Username': email,
                'ConfirmationCode': confirmation_code,
                'Password': new_password
            }
            
            if self.client_secret:
                kwargs['SecretHash'] = self._calculate_secret_hash(email)
            
            response = self.client.confirm_forgot_password(**kwargs)
            return response
            
        except ClientError as e:
            error_message = e.response['Error']['Message']
            raise AuthenticationException(f"Password reset failed: {error_message}")


# Global auth service instance
auth_service = CognitoAuthService()