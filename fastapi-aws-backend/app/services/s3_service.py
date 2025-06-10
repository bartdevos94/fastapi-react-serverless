import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from typing import Optional, Dict, Any, BinaryIO
import uuid
from datetime import datetime, timedelta

from app.core.config import settings
from app.utils.cache import lru_ttl_cache


class S3Service:
    """S3 service for file operations with caching and best practices."""
    
    def __init__(self):
        session = boto3.Session(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.S3_REGION
        )
        self.s3_client = session.client('s3')
        self.s3_resource = session.resource('s3')
        self.bucket_name = settings.S3_BUCKET_NAME
    
    async def upload_file(self, file_obj: BinaryIO, key: str = None, 
                         content_type: str = None, metadata: Dict[str, str] = None) -> str:
        """
        Upload file to S3.
        
        Args:
            file_obj: File object to upload
            key: S3 object key (if None, generates UUID)
            content_type: MIME type of the file
            metadata: Additional metadata for the file
            
        Returns:
            S3 object key
        """
        try:
            if key is None:
                key = f"uploads/{uuid.uuid4()}"
            
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
            if metadata:
                extra_args['Metadata'] = metadata
            
            # Add cache control headers
            extra_args['CacheControl'] = 'max-age=31536000'  # 1 year
            
            self.s3_client.upload_fileobj(
                file_obj,
                self.bucket_name,
                key,
                ExtraArgs=extra_args
            )
            
            return key
            
        except (ClientError, NoCredentialsError) as e:
            print(f"Error uploading file to S3: {e}")
            raise
    
    async def download_file(self, key: str) -> bytes:
        """
        Download file from S3.
        
        Args:
            key: S3 object key
            
        Returns:
            File content as bytes
        """
        try:
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=key)
            return response['Body'].read()
            
        except ClientError as e:
            print(f"Error listing files in S3: {e}")
            raise


# Global S3 service instance
s3_service = S3Service():
            if e.response['Error']['Code'] == 'NoSuchKey':
                return None
            print(f"Error downloading file from S3: {e}")
            raise
    
    async def delete_file(self, key: str) -> bool:
        """
        Delete file from S3.
        
        Args:
            key: S3 object key
            
        Returns:
            True if successful
        """
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=key)
            return True
            
        except ClientError as e:
            print(f"Error deleting file from S3: {e}")
            raise
    
    @lru_ttl_cache(ttl=300)  # Cache for 5 minutes
    async def get_file_metadata(self, key: str) -> Optional[Dict[str, Any]]:
        """
        Get file metadata from S3 with caching.
        
        Args:
            key: S3 object key
            
        Returns:
            File metadata or None if not found
        """
        try:
            response = self.s3_client.head_object(Bucket=self.bucket_name, Key=key)
            return {
                'size': response['ContentLength'],
                'last_modified': response['LastModified'],
                'content_type': response.get('ContentType'),
                'metadata': response.get('Metadata', {}),
                'etag': response['ETag'].strip('"')
            }
            
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return None
            print(f"Error getting file metadata from S3: {e}")
            raise
    
    async def generate_presigned_url(self, key: str, expiration: int = 3600, 
                                   method: str = 'get_object') -> str:
        """
        Generate presigned URL for S3 object.
        
        Args:
            key: S3 object key
            expiration: URL expiration time in seconds
            method: S3 operation (get_object, put_object, etc.)
            
        Returns:
            Presigned URL
        """
        try:
            params = {'Bucket': self.bucket_name, 'Key': key}
            
            url = self.s3_client.generate_presigned_url(
                method,
                Params=params,
                ExpiresIn=expiration
            )
            
            return url
            
        except ClientError as e:
            print(f"Error generating presigned URL: {e}")
            raise
    
    async def copy_file(self, source_key: str, destination_key: str, 
                       metadata: Dict[str, str] = None) -> bool:
        """
        Copy file within S3 bucket.
        
        Args:
            source_key: Source S3 object key
            destination_key: Destination S3 object key
            metadata: New metadata for the copied file
            
        Returns:
            True if successful
        """
        try:
            copy_source = {'Bucket': self.bucket_name, 'Key': source_key}
            
            extra_args = {}
            if metadata:
                extra_args['Metadata'] = metadata
                extra_args['MetadataDirective'] = 'REPLACE'
            
            self.s3_client.copy_object(
                CopySource=copy_source,
                Bucket=self.bucket_name,
                Key=destination_key,
                **extra_args
            )
            
            return True
            
        except ClientError as e:
            print(f"Error copying file in S3: {e}")
            raise
    
    async def list_files(self, prefix: str = "", max_keys: int = 1000) -> List[Dict[str, Any]]:
        """
        List files in S3 bucket.
        
        Args:
            prefix: Key prefix to filter files
            max_keys: Maximum number of files to return
            
        Returns:
            List of file information
        """
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix,
                MaxKeys=max_keys
            )
            
            files = []
            for obj in response.get('Contents', []):
                files.append({
                    'key': obj['Key'],
                    'size': obj['Size'],
                    'last_modified': obj['LastModified'],
                    'etag': obj['ETag'].strip('"')
                })
            
            return files
            
        except ClientError as e