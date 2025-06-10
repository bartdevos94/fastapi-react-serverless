# app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import (
    UserSignUp, UserLogin, TokenResponse, EmailConfirmation,
    PasswordReset, PasswordResetConfirm, RefreshTokenRequest
)
from app.services.user_service import user_service
from app.api.deps import get_current_user
from app.core.exceptions import AuthenticationException

router = APIRouter()


@router.post("/signup", response_model=dict)
async def sign_up(user_data: UserSignUp):
    """Register a new user."""
    try:
        user = await user_service.create_user(
            email=user_data.email,
            password=user_data.password,
            profile_data={
                "first_name": user_data.first_name,
                "last_name": user_data.last_name,
                "phone_number": user_data.phone_number
            }
        )
        return {
            "message": "User created successfully. Please check your email for verification.",
            "user_id": user["user_id"]
        }
    except AuthenticationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/confirm-email", response_model=dict)
async def confirm_email(confirmation: EmailConfirmation):
    """Confirm user email verification."""
    try:
        await user_service.confirm_user_email(
            email=confirmation.email,
            confirmation_code=confirmation.confirmation_code
        )
        return {"message": "Email confirmed successfully"}
    except AuthenticationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin):
    """Authenticate user and return tokens."""
    try:
        auth_result = await user_service.authenticate_user(
            email=user_credentials.email,
            password=user_credentials.password
        )
        
        tokens = auth_result["tokens"]
        return TokenResponse(
            access_token=tokens["AccessToken"],
            refresh_token=tokens["RefreshToken"],
            expires_in=tokens["ExpiresIn"]
        )
    except AuthenticationException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(token_request: RefreshTokenRequest):
    """Refresh access token."""
    try:
        tokens = await user_service.refresh_user_token(token_request.refresh_token)
        return TokenResponse(
            access_token=tokens["AccessToken"],
            refresh_token=tokens.get("RefreshToken", token_request.refresh_token),
            expires_in=tokens["ExpiresIn"]
        )
    except AuthenticationException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/logout", response_model=dict)
async def logout(current_user: dict = Depends(get_current_user)):
    """Sign out current user."""
    # Note: In a real implementation, you'd get the access token from the request
    # For simplicity, we're just returning a success message
    return {"message": "Logged out successfully"}


@router.post("/forgot-password", response_model=dict)
async def forgot_password(password_reset: PasswordReset):
    """Initiate password reset process."""
    try:
        await user_service.initiate_password_reset(password_reset.email)
        return {"message": "Password reset code sent to your email"}
    except AuthenticationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/reset-password", response_model=dict)
async def reset_password(password_reset: PasswordResetConfirm):
    """Confirm password reset with new password."""
    try:
        await user_service.confirm_password_reset(
            email=password_reset.email,
            confirmation_code=password_reset.confirmation_code,
            new_password=password_reset.new_password
        )
        return {"message": "Password reset successfully"}
    except AuthenticationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))