# app/models/base.py
from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class BaseModelWithTimestamp(BaseModel):
    """Base model with common timestamp fields."""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True