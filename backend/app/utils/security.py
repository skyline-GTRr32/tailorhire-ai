# Security utilities
import time
from collections import defaultdict
from fastapi import HTTPException, Request
from typing import Dict

# Simple in-memory rate limiting (use Redis in production)
request_counts: Dict[str, list] = defaultdict(list)

def rate_limit(request: Request) -> str:
    """Simple rate limiting by IP"""
    client_ip = request.client.host
    current_time = time.time()
    
    # Clean old requests (older than 1 hour)
    request_counts[client_ip] = [
        req_time for req_time in request_counts[client_ip]
        if current_time - req_time < 3600
    ]
    
    # Check rate limit (max 100 requests per hour)
    if len(request_counts[client_ip]) >= 100:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please try again later."
        )
    
    # Add current request
    request_counts[client_ip].append(current_time)
    
    return client_ip

def verify_api_key(api_key: str) -> bool:
    """Verify API key (placeholder for now)"""
    # In production, verify against database
    return True