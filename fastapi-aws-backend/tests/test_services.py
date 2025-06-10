# tests/test_services.py
import pytest
from app.services.dynamodb_service import dynamodb_service
from app.services.s3_service import s3_service
from app.utils.cache import cache, lru_ttl_cache


@pytest.mark.asyncio
class TestDynamoDBService:
    """Test DynamoDB service."""
    
    async def test_put_and_get_item(self, dynamodb_table):
        """Test putting and getting an item."""
        item = {
            "user_id": "test-user-123",
            "email": "test@example.com",
            "name": "Test User"
        }
        
        # Put item
        result = await dynamodb_service.put_item(
            dynamodb_table.table_name, 
            item
        )
        assert result is True
        
        # Get item
        retrieved_item = await dynamodb_service.get_item(
            dynamodb_table.table_name,
            {"user_id": "test-user-123"}
        )
        assert retrieved_item is not None
        assert retrieved_item["email"] == "test@example.com"
    
    async def test_update_item(self, dynamodb_table):
        """Test updating an item."""
        # First put an item
        item = {
            "user_id": "test-user-456",
            "email": "test2@example.com",
            "name": "Test User 2"
        }
        await dynamodb_service.put_item(dynamodb_table.table_name, item)
        
        # Update the item
        updated_item = await dynamodb_service.update_item(
            dynamodb_table.table_name,
            {"user_id": "test-user-456"},
            "SET #name = :name",
            {":name": "Updated Name"},
            {"#name": "name"}
        )
        
        assert updated_item["name"] == "Updated Name"


@pytest.mark.asyncio
class TestS3Service:
    """Test S3 service."""
    
    async def test_upload_and_download_file(self, s3_bucket):
        """Test uploading and downloading a file."""
        file_content = b"test file content"
        file_key = "test-files/test.txt"
        
        # Upload file
        from io import BytesIO
        file_obj = BytesIO(file_content)
        uploaded_key = await s3_service.upload_file(
            file_obj, 
            key=file_key,
            content_type="text/plain"
        )
        
        assert uploaded_key == file_key
        
        # Download file
        downloaded_content = await s3_service.download_file(file_key)
        assert downloaded_content == file_content
    
    async def test_get_file_metadata(self, s3_bucket):
        """Test getting file metadata."""
        file_content = b"metadata test content"
        file_key = "test-files/metadata-test.txt"
        
        # Upload file first
        from io import BytesIO
        file_obj = BytesIO(file_content)
        await s3_service.upload_file(
            file_obj,
            key=file_key,
            content_type="text/plain",
            metadata={"author": "test-user"}
        )
        
        # Get metadata
        metadata = await s3_service.get_file_metadata(file_key)
        assert metadata is not None
        assert metadata["size"] == len(file_content)
        assert metadata["content_type"] == "text/plain"


@pytest.mark.asyncio
class TestCache:
    """Test caching functionality."""
    
    async def test_cache_set_and_get(self):
        """Test setting and getting cache values."""
        await cache.set("test_key", "test_value", ttl=60)
        
        value = await cache.get("test_key")
        assert value == "test_value"
    
    async def test_cache_expiration(self):
        """Test cache expiration."""
        await cache.set("expire_key", "expire_value", ttl=1)
        
        # Should be available immediately
        value = await cache.get("expire_key")
        assert value == "expire_value"
        
        # Wait for expiration (in real tests, you might mock time)
        import asyncio
        await asyncio.sleep(2)
        
        expired_value = await cache.get("expire_key")
        assert expired_value is None
    
    async def test_lru_ttl_cache_decorator(self):
        """Test LRU TTL cache decorator."""
        call_count = 0
        
        @lru_ttl_cache(ttl=60)
        async def cached_function(param):
            nonlocal call_count
            call_count += 1
            return f"result_{param}"
        
        # First call
        result1 = await cached_function("test")
        assert result1 == "result_test"
        assert call_count == 1
        
        # Second call with same parameter (should be cached)
        result2 = await cached_function("test")
        assert result2 == "result_test"
        assert call_count == 1  # Should not increment
        
        # Third call with different parameter
        result3 = await cached_function("different")
        assert result3 == "result_different"
        assert call_count == 2