import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError
from typing import Dict, List, Optional, Any
import json
from decimal import Decimal

from app.core.config import settings
from app.utils.cache import lru_ttl_cache


class DecimalEncoder(json.JSONEncoder):
    """Helper class to convert Decimal to JSON serializable types."""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)


class DynamoDBService:
    """DynamoDB service with caching and best practices."""
    
    def __init__(self):
        session = boto3.Session(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.dynamodb = session.resource('dynamodb')
        self.client = session.client('dynamodb')
    
    def get_table(self, table_name: str):
        """Get DynamoDB table resource."""
        return self.dynamodb.Table(table_name)
    
    @lru_ttl_cache(ttl=300)  # Cache for 5 minutes
    async def get_item(self, table_name: str, key: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Get item from DynamoDB table with caching.
        
        Args:
            table_name: Name of the DynamoDB table
            key: Primary key of the item
            
        Returns:
            Item if found, None otherwise
        """
        try:
            table = self.get_table(table_name)
            response = table.get_item(Key=key)
            
            if 'Item' in response:
                # Convert Decimals to floats for JSON serialization
                item = json.loads(json.dumps(response['Item'], cls=DecimalEncoder))
                return item
            return None
            
        except ClientError as e:
            print(f"Error getting item from {table_name}: {e}")
            raise
    
    async def put_item(self, table_name: str, item: Dict[str, Any]) -> bool:
        """
        Put item into DynamoDB table.
        
        Args:
            table_name: Name of the DynamoDB table
            item: Item to insert/update
            
        Returns:
            True if successful
        """
        try:
            table = self.get_table(table_name)
            table.put_item(Item=item)
            return True
            
        except ClientError as e:
            print(f"Error putting item to {table_name}: {e}")
            raise
    
    async def update_item(self, table_name: str, key: Dict[str, Any], 
                         update_expression: str, expression_attribute_values: Dict[str, Any],
                         expression_attribute_names: Dict[str, str] = None) -> Dict[str, Any]:
        """
        Update item in DynamoDB table.
        
        Args:
            table_name: Name of the DynamoDB table
            key: Primary key of the item
            update_expression: DynamoDB update expression
            expression_attribute_values: Values for the update expression
            expression_attribute_names: Names for the update expression
            
        Returns:
            Updated item attributes
        """
        try:
            table = self.get_table(table_name)
            
            kwargs = {
                'Key': key,
                'UpdateExpression': update_expression,
                'ExpressionAttributeValues': expression_attribute_values,
                'ReturnValues': 'ALL_NEW'
            }
            
            if expression_attribute_names:
                kwargs['ExpressionAttributeNames'] = expression_attribute_names
            
            response = table.update_item(**kwargs)
            return json.loads(json.dumps(response['Attributes'], cls=DecimalEncoder))
            
        except ClientError as e:
            print(f"Error updating item in {table_name}: {e}")
            raise
    
    async def delete_item(self, table_name: str, key: Dict[str, Any]) -> bool:
        """
        Delete item from DynamoDB table.
        
        Args:
            table_name: Name of the DynamoDB table
            key: Primary key of the item to delete
            
        Returns:
            True if successful
        """
        try:
            table = self.get_table(table_name)
            table.delete_item(Key=key)
            return True
            
        except ClientError as e:
            print(f"Error deleting item from {table_name}: {e}")
            raise
    
    @lru_ttl_cache(ttl=60)  # Cache for 1 minute
    async def query_items(self, table_name: str, key_condition_expression,
                         filter_expression=None, limit: int = None) -> List[Dict[str, Any]]:
        """
        Query items from DynamoDB table with caching.
        
        Args:
            table_name: Name of the DynamoDB table
            key_condition_expression: Query condition
            filter_expression: Optional filter expression
            limit: Maximum number of items to return
            
        Returns:
            List of items
        """
        try:
            table = self.get_table(table_name)
            
            kwargs = {'KeyConditionExpression': key_condition_expression}
            
            if filter_expression:
                kwargs['FilterExpression'] = filter_expression
            if limit:
                kwargs['Limit'] = limit
            
            response = table.query(**kwargs)
            items = response.get('Items', [])
            
            # Convert Decimals to floats
            return [json.loads(json.dumps(item, cls=DecimalEncoder)) for item in items]
            
        except ClientError as e:
            print(f"Error querying {table_name}: {e}")
            raise
    
    @lru_ttl_cache(ttl=300)  # Cache for 5 minutes
    async def scan_table(self, table_name: str, filter_expression=None, 
                        limit: int = None) -> List[Dict[str, Any]]:
        """
        Scan DynamoDB table with caching.
        
        Args:
            table_name: Name of the DynamoDB table
            filter_expression: Optional filter expression
            limit: Maximum number of items to return
            
        Returns:
            List of items
        """
        try:
            table = self.get_table(table_name)
            
            kwargs = {}
            if filter_expression:
                kwargs['FilterExpression'] = filter_expression
            if limit:
                kwargs['Limit'] = limit
            
            response = table.scan(**kwargs)
            items = response.get('Items', [])
            
            # Convert Decimals to floats
            return [json.loads(json.dumps(item, cls=DecimalEncoder)) for item in items]
            
        except ClientError as e:
            print(f"Error scanning {table_name}: {e}")
            raise


# Global DynamoDB service instance
dynamodb_service = DynamoDBService()