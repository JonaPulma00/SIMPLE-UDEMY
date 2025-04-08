from fastapi import Depends, HTTPException, status
from app.middlewares.authenticate_token import verify_token

def verify_instructor(token_payload: dict = Depends(verify_token)):
    if not token_payload.get("is_instructor"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to do this action")
    return token_payload
