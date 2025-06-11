import asyncio
import functools
import time
from typing import Any, Dict, Callable, Optional
from app.core.config import settings


class TTLCache:
    """Simple TTL cache implementation."""
    
    def __init__(self):
        self._cache: Dict[str, Dict] = {}
        self._lock = asyncio.Lock()
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired."""
        async with self._lock:
            if key in self._cache:
                entry = self._cache[key]
                if time.time() < entry['expires']:
                    return entry['value']
                else:
                    del self._cache[key]
            return None
    
    async def set(self, key: str, value: Any, ttl: int = None) -> None:
        """Set value in cache with TTL."""
        if ttl is None:
            ttl = settings.CACHE_TTL
        
        async with self._lock:
            self._cache[key] = {
                'value': value,
                'expires': time.time() + ttl
            }
    
    async def delete(self, key: str) -> None:
        """Delete key from cache."""
        async with self._lock:
            self._cache.pop(key, None)
    
    async def clear(self) -> None:
        """Clear all cache entries."""
        async with self._lock:
            self._cache.clear()


# Global cache instance
cache = TTLCache()


def lru_ttl_cache(ttl: int = None, maxsize: int = 128):
    """
    Decorator that combines LRU cache with TTL functionality.
    
    Args:
        ttl: Time to live in seconds
        maxsize: Maximum number of entries to keep in cache
    """
    def decorator(func: Callable) -> Callable:
        if asyncio.iscoroutinefunction(func):
            # Async function
            @functools.wraps(func)
            async def async_wrapper(*args, **kwargs):
                # Create cache key from function name and arguments
                key = f"{func.__name__}:{hash(str(args) + str(sorted(kwargs.items())))}"
                
                # Try to get from cache
                cached_result = await cache.get(key)
                if cached_result is not None:
                    return cached_result
                
                # Execute function and cache result
                result = await func(*args, **kwargs)
                await cache.set(key, result, ttl or settings.CACHE_TTL)
                return result
            
            return async_wrapper
        else:
            # Sync function with functools.lru_cache
            @functools.lru_cache(maxsize=maxsize)
            @functools.wraps(func)
            def sync_wrapper(*args, **kwargs):
                return func(*args, **kwargs)
            
            return sync_wrapper
    
    return decorator


def cache_key(*args, **kwargs) -> str:
    """Generate cache key from arguments."""
    return f"{hash(str(args) + str(sorted(kwargs.items())))}"


async def invalidate_cache_pattern(pattern: str) -> None:
    """Invalidate cache entries matching pattern."""
    async with cache._lock:
        keys_to_delete = [key for key in cache._cache.keys() if pattern in key]
        for key in keys_to_delete:
            del cache._cache[key]