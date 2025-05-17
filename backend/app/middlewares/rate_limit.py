from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request, HTTPException, status
from slowapi.errors import RateLimitExceeded


limiter = Limiter(key_func=get_remote_address)


def rate_limit_dependency(request: Request, limit: str = "5/minute"):
    try:
        limiter.limit(limit)(lambda req: None)(request)
        return True
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, 
            detail="Too many requests"
        )