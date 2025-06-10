from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.exceptions import setup_exception_handlers

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=settings.DESCRIPTION,
        openapi_url=f"/openapi.json" if settings.ENVIRONMENT != "production" else None,
        docs_url=f"/docs" if settings.ENVIRONMENT != "production" else None,
        redoc_url=f"/redoc" if settings.ENVIRONMENT != "production" else None,
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_HOSTS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # Setup exception handlers
    setup_exception_handlers(app)

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "version": settings.VERSION}

    return app

app = create_app()

# Lambda handler
lambda_handler = Mangum(app)