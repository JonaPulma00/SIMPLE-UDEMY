from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import traceback

class ExceptionHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as e:

            print(f"Unhandled error: {str(e)}")
            traceback.print_exc()
            
            return JSONResponse(
                status_code=500,
                content={"detail": "An internal server error occurred."}
            )