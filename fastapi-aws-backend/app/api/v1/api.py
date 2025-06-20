# app/api/v1/api.py
from fastapi import APIRouter
from app.api.v1 import auth, users

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])