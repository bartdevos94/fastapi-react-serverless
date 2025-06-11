# app/api/v1/users.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from app.models.user import UserResponse, UserUpdate
from app.models.file import FileUploadResponse, PresignedUrlRequest, PresignedUrlResponse
from app.services.user_service import user_service
from app.services.s3_service import s3_service
from app.api.deps import get_current_user, get_current_verified_user
from app.core.exceptions import UserNotFoundException

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile."""
    return UserResponse(**current_user)


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update current user profile."""
    try:
        updated_user = await user_service.update_user(
            current_user["user_id"],
            user_update.dict(exclude_unset=True)
        )
        return UserResponse(**updated_user)
    except UserNotFoundException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


@router.delete("/me", response_model=dict)
async def delete_current_user(current_user: dict = Depends(get_current_user)):
    """Delete current user account."""
    try:
        await user_service.delete_user(current_user["user_id"])
        return {"message": "Account deleted successfully"}
    except UserNotFoundException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    current_user: dict = Depends(get_current_verified_user)
):
    """Get user by ID (requires verified user)."""
    try:
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return UserResponse(**user)
    except UserNotFoundException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


@router.post("/upload-avatar", response_model=FileUploadResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload user avatar."""
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files are allowed"
        )
    
    # Validate file size (5MB max)
    max_size = 5 * 1024 * 1024  # 5MB
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds 5MB limit"
        )
    
    # Reset file pointer
    await file.seek(0)
    
    # Upload to S3
    file_key = f"avatars/{current_user['user_id']}/{file.filename}"
    uploaded_key = await s3_service.upload_file(
        file.file,
        key=file_key,
        content_type=file.content_type,
        metadata={"user_id": current_user["user_id"]}
    )
    
    # Update user profile with avatar URL
    await user_service.update_user(
        current_user["user_id"],
        {"avatar_key": uploaded_key}
    )
    
    return FileUploadResponse(
        file_key=uploaded_key,
        file_size=len(file_content),
        content_type=file.content_type
    )


@router.post("/presigned-url", response_model=PresignedUrlResponse)
async def get_presigned_url(
    request: PresignedUrlRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate presigned URL for file access."""
    # Ensure user can only access their own files
    if not request.file_key.startswith(f"uploads/{current_user['user_id']}/"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this file"
        )
    
    url = await s3_service.generate_presigned_url(
        request.file_key,
        expiration=request.expiration,
        method=request.operation
    )
    
    return PresignedUrlResponse(
        url=url,
        expires_in=request.expiration
    )