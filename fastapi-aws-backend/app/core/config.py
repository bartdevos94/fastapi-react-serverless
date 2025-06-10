import os
from typing import List, Optional
from pydantic import BaseSettings, validator


class Settings(BaseSettings):
    # Basic app settings
    PROJECT_NAME: str = "FastAPI AWS Boilerplate"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "FastAPI application with AWS services"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # AWS Settings
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    
    # DynamoDB
    DYNAMODB_TABLE_PREFIX: str = "fastapi-app"
    USERS_TABLE_NAME: str = f"{DYNAMODB_TABLE_PREFIX}-users"
    
    # Cognito
    COGNITO_USER_POOL_ID: str
    COGNITO_CLIENT_ID: str
    COGNITO_CLIENT_SECRET: Optional[str] = None
    COGNITO_REGION: str = AWS_REGION
    
    # S3
    S3_BUCKET_NAME: str
    S3_REGION: str = AWS_REGION
    
    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-change-this"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Cache settings
    CACHE_TTL: int = 300  # 5 minutes
    
    @validator("ALLOWED_HOSTS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()