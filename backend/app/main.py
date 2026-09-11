from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import init_db
from app.api.v1.auth import router as auth_router
from app.api.v1.assessment import router as assessment_router
from app.api.v1.modules import router as modules_router
from app.api.v1.sentiment import router as sentiment_router
from app.api.v1.claims import router as claims_router
from app.api.v1.portfolio import router as portfolio_router
from app.api.v1.decisions import router as decisions_router
from app.api.v1.insights import router as insights_router
from app.api.v1.commodities import router as commodities_router
from app.api.v1.news import router as news_router
from app.api.v1.market_floor import router as market_floor_router
from app.api.v1.integrity import router as integrity_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    await init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Financial Observatory & Behavioral Practice Companion API",
    version="0.1.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(assessment_router, prefix=settings.API_V1_STR)
app.include_router(modules_router, prefix=settings.API_V1_STR)
app.include_router(sentiment_router, prefix=settings.API_V1_STR)
app.include_router(claims_router, prefix=settings.API_V1_STR)
app.include_router(portfolio_router, prefix=settings.API_V1_STR)
app.include_router(decisions_router, prefix=settings.API_V1_STR)
app.include_router(insights_router, prefix=settings.API_V1_STR)
app.include_router(commodities_router, prefix=settings.API_V1_STR)
app.include_router(news_router, prefix=settings.API_V1_STR)
app.include_router(market_floor_router, prefix=settings.API_V1_STR)
app.include_router(integrity_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "lucid-api",
        "version": "0.1.0"
    }

@app.get("/")
async def root():
    return {
        "brand": "LUCID",
        "tagline": "See the market clearly.",
        "docs": "/docs"
    }
