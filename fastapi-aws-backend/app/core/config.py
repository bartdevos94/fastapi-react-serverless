import os
from typing import List, Optional, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Basic app settings
    PROJECT_NAME: str = "FastAPI AWS Boilerplate"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "FastAPI application with AWS services"
    API_V1_STR: str = "v1"
    ENVIRONMENT: str = "development"
    
    # CORS - Change the type to handle both string and list
    ALLOWED_HOSTS: Union[List[str], str] = ["*"]
    
    # AWS Settings
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    
    # DynamoDB
    DYNAMODB_TABLE_PREFIX: str = "fastapi-app"
    USERS_TABLE_NAME: str = f"{DYNAMODB_TABLE_PREFIX}-users"
    
    # Cognito - Make these optional with defaults for development
    COGNITO_USER_POOL_ID: str = "us-east-1_XXXXXXXXX"
    COGNITO_CLIENT_ID: str = "your-client-id"
    COGNITO_CLIENT_SECRET: Optional[str] = None
    COGNITO_REGION: str = AWS_REGION
    
    # S3
    S3_BUCKET_NAME: str = "your-s3-bucket-name"
    S3_REGION: str = AWS_REGION
    
    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-change-this"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Cache settings
    CACHE_TTL: int = 300  # 5 minutes
    
    @field_validator("ALLOWED_HOSTS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            # Handle comma-separated string
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]  # Default fallback

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()