from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException
import jwt
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

class AuthenticateToken(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(status_code=401, detail="No s'ha proporcionat el header d'autorització")

        token = auth_header.split(" ")[1] if " " in auth_header else None
        if not token:
            raise HTTPException(status_code=401, detail="No s'ha proporcionat el token")

        try:
            request.state.user = jwt.decode(token, SECRET_KEY, algorithms=[os.getenv('JWT_ALGORITHM')])
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=403, detail="El token ha expirat")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=403, detail="Token invàlid")

        return await call_next(request)
