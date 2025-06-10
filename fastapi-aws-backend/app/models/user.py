# app/models/user.py
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from app.models.base import BaseModelWithTimestamp


class UserBase(BaseModel):
    """Base user model."""
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None


class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=8)
    confirm_password: str
    
    def validate_passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v


class UserUpdate(BaseModel):
    """User update model."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None


class UserResponse(UserBase, BaseModelWithTimestamp):
    """User response model."""
    user_id: str
    is_active: bool = True
    email_verified: bool = False
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str


class UserSignUp(UserCreate):
    """User sign-up model."""
    pass


class EmailConfirmation(BaseModel):
    """Email confirmation model."""
    email: EmailStr
    confirmation_code: str = Field(..., min_length=6, max_length=6)


class PasswordReset(BaseModel):
    """Password reset model."""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation model."""
    email: EmailStr
    confirmation_code: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8)
    confirm_password: str
    
    def validate_passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v


class TokenResponse(BaseModel):
    """Token response model."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    """Refresh token request model."""
    refresh_token: str