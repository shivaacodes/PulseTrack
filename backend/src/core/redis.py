from typing import Optional, Any, Union
import json
from redis import Redis, ConnectionPool
from redis.exceptions import RedisError
import logging
from functools import wraps
import time
from .config import get_redis_config, settings

logger = logging.getLogger(__name__)

class RedisClient:
    _instance = None
    _pool = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RedisClient, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._pool:
            redis_config = get_redis_config()
            self._pool = ConnectionPool(**redis_config)
        self.redis = Redis(connection_pool=self._pool)

    def get_connection(self) -> Redis:
        """Get Redis connection from pool"""
        return self.redis

    def set_key(self, key: str, value: Any, expire: Optional[int] = None) -> bool:
        """
        Set a key-value pair in Redis
        :param key: Redis key
        :param value: Value to store (will be JSON serialized)
        :param expire: Optional expiration time in seconds
        :return: True if successful, False otherwise
        """
        try:
            serialized_value = json.dumps(value)
            if expire:
                return self.redis.setex(key, expire, serialized_value)
            return self.redis.set(key, serialized_value)
        except (RedisError, TypeError) as e:
            logger.error(f"Error setting Redis key {key}: {str(e)}")
            return False

    def get_key(self, key: str) -> Optional[Any]:
        """
        Get a value from Redis
        :param key: Redis key
        :return: Deserialized value or None if not found/error
        """
        try:
            value = self.redis.get(key)
            if value:
                return json.loads(value)
            return None
        except (RedisError, json.JSONDecodeError) as e:
            logger.error(f"Error getting Redis key {key}: {str(e)}")
            return None

    def delete_key(self, key: str) -> bool:
        """
        Delete a key from Redis
        :param key: Redis key
        :return: True if successful, False otherwise
        """
        try:
            return bool(self.redis.delete(key))
        except RedisError as e:
            logger.error(f"Error deleting Redis key {key}: {str(e)}")
            return False

    def exists(self, key: str) -> bool:
        """
        Check if a key exists in Redis
        :param key: Redis key
        :return: True if key exists, False otherwise
        """
        try:
            return bool(self.redis.exists(key))
        except RedisError as e:
            logger.error(f"Error checking Redis key {key}: {str(e)}")
            return False

    def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """
        Increment a counter in Redis
        :param key: Redis key
        :param amount: Amount to increment by
        :return: New value or None if error
        """
        try:
            return self.redis.incrby(key, amount)
        except RedisError as e:
            logger.error(f"Error incrementing Redis key {key}: {str(e)}")
            return None

    def set_hash(self, name: str, mapping: dict, expire: Optional[int] = None) -> bool:
        """
        Set a hash in Redis
        :param name: Hash name
        :param mapping: Dictionary of key-value pairs
        :param expire: Optional expiration time in seconds
        :return: True if successful, False otherwise
        """
        try:
            serialized_mapping = {k: json.dumps(v) for k, v in mapping.items()}
            result = self.redis.hset(name, mapping=serialized_mapping)
            if expire:
                self.redis.expire(name, expire)
            return bool(result)
        except (RedisError, TypeError) as e:
            logger.error(f"Error setting Redis hash {name}: {str(e)}")
            return False

    def get_hash(self, name: str) -> Optional[dict]:
        """
        Get a hash from Redis
        :param name: Hash name
        :return: Dictionary of key-value pairs or None if error
        """
        try:
            data = self.redis.hgetall(name)
            if data:
                return {k: json.loads(v) for k, v in data.items()}
            return None
        except (RedisError, json.JSONDecodeError) as e:
            logger.error(f"Error getting Redis hash {name}: {str(e)}")
            return None

def cache(expire: int = None):
    """
    Decorator for caching function results in Redis
    :param expire: Cache expiration time in seconds (defaults to CACHE_TTL from settings)
    """
    if expire is None:
        expire = settings.CACHE_TTL

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            redis_client = RedisClient()
            
            # Try to get from cache
            cached_result = redis_client.get_key(cache_key)
            if cached_result is not None:
                return cached_result
            
            # If not in cache, execute function
            result = await func(*args, **kwargs)
            
            # Cache the result
            redis_client.set_key(cache_key, result, expire)
            return result
        return wrapper
    return decorator

def rate_limit(limit: int = None, period: int = None):
    """
    Decorator for rate limiting function calls
    :param limit: Maximum number of calls allowed in the period (defaults to RATE_LIMIT_REQUESTS from settings)
    :param period: Time period in seconds (defaults to RATE_LIMIT_PERIOD from settings)
    """
    if limit is None:
        limit = settings.RATE_LIMIT_REQUESTS
    if period is None:
        period = settings.RATE_LIMIT_PERIOD

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            redis_client = RedisClient()
            key = f"rate_limit:{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Get current count
            current = redis_client.increment(key)
            if current == 1:
                redis_client.redis.expire(key, period)
            
            if current and current > limit:
                raise Exception("Rate limit exceeded")
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Create a singleton instance
redis_client = RedisClient() 