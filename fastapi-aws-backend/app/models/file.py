# app/models/file.py
from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class FileUploadResponse(BaseModel):
    """File upload response model."""
    file_key: str
    file_size: int
    content_type: Optional[str] = None
    upload_url: Optional[str] = None


class FileMetadata(BaseModel):
    """File metadata model."""
    key: str
    size: int
    content_type: Optional[str] = None
    last_modified: datetime
    etag: str
    metadata: Dict[str, str] = {}


class PresignedUrlRequest(BaseModel):
    """Presigned URL request model."""
    file_key: str
    expiration: int = Field(default=3600, ge=1, le=604800)  # 1 second to 7 days
    operation: str = Field(default="get_object", regex="^(get_object|put_object)$")


class PresignedUrlResponse(BaseModel):
    """Presigned URL response model."""
    url: str
    expires_in: int