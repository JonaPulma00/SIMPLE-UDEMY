from fastapi import FastAPI, Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import traceback

class ExceptionHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except HTTPException as http_ex:
 
            return JSONResponse(
                status_code=http_ex.status_code,
                content={"detail": http_ex.detail}
            )
        except Exception as e:

            traceback.print_exc()
            
            return JSONResponse(
                status_code=500,
                content={"detail": "An internal server error occurred."},
                extended_details={"Error": str(e)}
            )