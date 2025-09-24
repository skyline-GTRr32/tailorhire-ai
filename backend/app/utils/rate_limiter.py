import time
from typing import Dict, Tuple, Optional, Callable, Any
from fastapi import HTTPException, Request

class RateLimiter:
    """
    Rate limiting middleware for FastAPI applications.
    Tracks the number of requests from each IP address within a time window.
    """
    
    def __init__(self, requests: int = 100, window: int = 60):
        """
        Initialize the rate limiter.
        
        Args:
            requests: Number of requests allowed per window
            window: Time window in seconds
        """
        self.requests = requests
        self.window = window
        self.access_records: Dict[str, Tuple[float, int]] = {}

    async def __call__(self, request: Request):
        """
        Check if the current request is within rate limits.
        
        Args:
            request: The incoming request
            
        Returns:
            str: Client IP if within rate limit
            
        Raises:
            HTTPException: 429 if rate limit is exceeded
        """
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean up old records
        self._cleanup_old_records(current_time)
        
        # Get or create record for this IP
        last_time, count = self.access_records.get(client_ip, (current_time, 0))
        
        # Check if within rate limit
        if current_time - last_time < self.window:
            if count >= self.requests:
                retry_after = int(self.window - (current_time - last_time))
                raise HTTPException(
                    status_code=429,
                    detail={
                        "error": "Too many requests",
                        "retry_after": retry_after,
                        "limit": self.requests,
                        "window": self.window
                    },
                    headers={"Retry-After": str(retry_after)}
                )
            self.access_records[client_ip] = (last_time, count + 1)
        else:
            self.access_records[client_ip] = (current_time, 1)
            
        return client_ip
    
    def _cleanup_old_records(self, current_time: float):
        """Remove records older than the time window"""
        expired_ips = [
            ip for ip, (timestamp, _) in self.access_records.items()
            if current_time - timestamp > self.window
        ]
        for ip in expired_ips:
            self.access_records.pop(ip, None)

# Create a default rate limiter instance
rate_limiter = RateLimiter(requests=100, window=60)  # 100 requests per minute
rate_limit = rate_limiter  # Alias for backward compatibility
