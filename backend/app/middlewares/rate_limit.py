from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request, HTTPException, Depends, status

limiter = Limiter(key_func=get_remote_address)

async def rate_limit(request: Request, limit: str = "5/minute"):
  try:
    limiter.limit(limit)(lambda req: None)(request)
  except Exception:
    raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")