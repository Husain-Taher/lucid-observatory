from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

import re
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

db_url = settings.DATABASE_URL
connect_args = {}

if "sqlite" in db_url:
    connect_args["check_same_thread"] = False
else:
    # Automatically convert postgresql:// to postgresql+asyncpg://
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    # Clean query parameters for asyncpg driver
    parsed = urlparse(db_url)
    qs = parse_qs(parsed.query)
    qs.pop("sslmode", None)
    qs.pop("channel_binding", None)
    new_query = urlencode(qs, doseq=True)
    parsed = parsed._replace(query=new_query)
    db_url = urlunparse(parsed)
    connect_args["ssl"] = True

from sqlalchemy.pool import NullPool

engine_kwargs = {
    "echo": False,
    "connect_args": connect_args,
    "future": True,
}
if "postgres" in db_url:
    engine_kwargs["poolclass"] = NullPool
else:
    engine_kwargs["pool_pre_ping"] = True

engine = create_async_engine(db_url, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    # Import all models before creating tables
    import app.models  # noqa
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
