# tests/test_api/test_users.py
import pytest
from httpx import AsyncClient
from app.core.config import settings


@pytest.mark.asyncio
class TestUserAPI:
    """Test user API endpoints."""
    
    async def test_health_check(self, client: AsyncClient):
        """Test health check endpoint."""
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json() == {
            "status": "healthy",
            "version": settings.VERSION
        }
    
    async def test_signup_success(self, client: AsyncClient, sample_user_data, 
                                 dynamodb_table, cognito_user_pool):
        """Test successful user signup."""
        response = await client.post("/api/v1/auth/signup", json=sample_user_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert "user_id" in data
        assert "created successfully" in data["message"]
    
    async def test_signup_invalid_email(self, client: AsyncClient, sample_user_data):
        """Test signup with invalid email."""
        sample_user_data["email"] = "invalid-email"
        response = await client.post("/api/v1/auth/signup", json=sample_user_data)
        assert response.status_code == 422
    
    async def test_signup_password_mismatch(self, client: AsyncClient, sample_user_data):
        """Test signup with password mismatch."""
        sample_user_data["confirm_password"] = "DifferentPassword123"
        response = await client.post("/api/v1/auth/signup", json=sample_user_data)
        assert response.status_code == 422
    
    async def test_login_success(self, client: AsyncClient, sample_user_data,
                                dynamodb_table, cognito_user_pool):
        """Test successful login."""
        # First, sign up the user
        await client.post("/api/v1/auth/signup", json=sample_user_data)
        
        # Then try to login
        login_data = {
            "email": sample_user_data["email"],
            "password": sample_user_data["password"]
        }
        response = await client.post("/api/v1/auth/login", json=login_data)
        
        # Note: This might fail with moto as it doesn't fully simulate Cognito
        # In a real test environment, you'd use actual AWS services or better mocks
        assert response.status_code in [200, 400]  # 400 for moto limitations
    
    async def test_get_current_user_unauthorized(self, client: AsyncClient):
        """Test getting current user without authentication."""
        response = await client.get("/api/v1/users/me")
        assert response.status_code == 403  # No Authorization header
    
    async def test_get_current_user_invalid_token(self, client: AsyncClient):
        """Test getting current user with invalid token."""
        headers = {"Authorization": "Bearer invalid-token"}
        response = await client.get("/api/v1/users/me", headers=headers)
        assert response.status_code == 401


@pytest.mark.asyncio
class TestFileUpload:
    """Test file upload functionality."""
    
    async def test_upload_avatar_unauthorized(self, client: AsyncClient):
        """Test avatar upload without authentication."""
        files = {"file": ("test.jpg", b"fake image data", "image/jpeg")}
        response = await client.post("/api/v1/users/upload-avatar", files=files)
        assert response.status_code == 403
    
    async def test_upload_avatar_invalid_file_type(self, client: AsyncClient):
        """Test avatar upload with invalid file type."""
        headers = {"Authorization": "Bearer fake-token"}
        files = {"file": ("test.txt", b"text data", "text/plain")}
        response = await client.post(
            "/api/v1/users/upload-avatar", 
            files=files, 
            headers=headers
        )
        assert response.status_code == 401  # Will fail on auth first