# tests/conftest.py
import pytest
import asyncio
from typing import Generator, Dict, Any
from httpx import AsyncClient
from moto import mock_dynamodb, mock_s3, mock_cognitoidp
import boto3
from app.main import app
from app.core.config import settings


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def client() -> AsyncClient:
    """Create test client."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def mock_aws():
    """Mock AWS services."""
    with mock_dynamodb(), mock_s3(), mock_cognitoidp():
        yield


@pytest.fixture
def dynamodb_table(mock_aws):
    """Create DynamoDB table for testing."""
    dynamodb = boto3.resource('dynamodb', region_name=settings.AWS_REGION)
    
    table = dynamodb.create_table(
        TableName=settings.USERS_TABLE_NAME,
        KeySchema=[
            {'AttributeName': 'user_id', 'KeyType': 'HASH'}
        ],
        AttributeDefinitions=[
            {'AttributeName': 'user_id', 'AttributeType': 'S'},
            {'AttributeName': 'email', 'AttributeType': 'S'}
        ],
        GlobalSecondaryIndexes=[
            {
                'IndexName': 'EmailIndex',
                'KeySchema': [
                    {'AttributeName': 'email', 'KeyType': 'HASH'}
                ],
                'Projection': {'ProjectionType': 'ALL'},
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
            }
        ],
        BillingMode='PROVISIONED',
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    )
    
    return table


@pytest.fixture
def s3_bucket(mock_aws):
    """Create S3 bucket for testing."""
    s3 = boto3.client('s3', region_name=settings.AWS_REGION)
    s3.create_bucket(Bucket=settings.S3_BUCKET_NAME)
    return s3


@pytest.fixture
def cognito_user_pool(mock_aws):
    """Create Cognito User Pool for testing."""
    cognito = boto3.client('cognito-idp', region_name=settings.AWS_REGION)
    
    response = cognito.create_user_pool(
        PoolName='test-pool',
        Policies={
            'PasswordPolicy': {
                'MinimumLength': 8,
                'RequireUppercase': True,
                'RequireLowercase': True,
                'RequireNumbers': True,
                'RequireSymbols': False
            }
        },
        AutoVerifiedAttributes=['email'],
        UsernameAttributes=['email']
    )
    
    user_pool_id = response['UserPool']['Id']
    
    client_response = cognito.create_user_pool_client(
        UserPoolId=user_pool_id,
        ClientName='test-client',
        ExplicitAuthFlows=[
            'ALLOW_USER_PASSWORD_AUTH',
            'ALLOW_REFRESH_TOKEN_AUTH'
        ]
    )
    
    return {
        'user_pool_id': user_pool_id,
        'client_id': client_response['UserPoolClient']['ClientId']
    }


@pytest.fixture
def sample_user_data() -> Dict[str, Any]:
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "password": "TestPassword123",
        "confirm_password": "TestPassword123",
        "first_name": "Test",
        "last_name": "User",
        "phone_number": "+1234567890"
    }