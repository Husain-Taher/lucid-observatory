from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from app.models import User, LiteracyProfile, Portfolio
from app.schemas import UserRegister, UserLogin, Token, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])

async def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    if not authorization:
        return None
    token = authorization.replace("Bearer ", "").strip()
    user_id = decode_access_token(token)
    if not user_id:
        return None
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    user = await get_current_user_optional(authorization, db)
    if user:
        return user
        
    # Auto-provision or find default anonymous demo user for immediate friction-free learning
    demo_email = "observer@lucid.local"
    result = await db.execute(select(User).where(User.email == demo_email))
    demo_user = result.scalar_one_or_none()
    if not demo_user:
        demo_user = User(
            email=demo_email,
            display_name="Observer",
            hashed_password=get_password_hash("lucid-demo-password")
        )
        db.add(demo_user)
        await db.flush()
        
        # Add default literacy profile
        profile = LiteracyProfile(user_id=demo_user.id)
        db.add(profile)
        
        # Add default paper portfolio ($100k)
        portfolio = Portfolio(user_id=demo_user.id, cash_balance=100000.0)
        db.add(portfolio)
        
        await db.commit()
        await db.refresh(demo_user)
        
    return demo_user

@router.post("/register", response_model=Token)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email is already registered.")
        
    user = User(
        email=payload.email,
        display_name=payload.display_name or payload.email.split("@")[0].capitalize(),
        hashed_password=get_password_hash(payload.password)
    )
    db.add(user)
    await db.flush()
    
    # Initialize Literacy Profile & Paper Portfolio
    profile = LiteracyProfile(user_id=user.id)
    db.add(profile)
    portfolio = Portfolio(user_id=user.id, cash_balance=100000.0)
    db.add(portfolio)
    
    await db.commit()
    await db.refresh(user)
    
    token = create_access_token(user.id)
    return Token(access_token=token, user_id=user.id, email=user.email, display_name=user.display_name)

@router.post("/login", response_model=Token)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    token = create_access_token(user.id)
    return Token(access_token=token, user_id=user.id, email=user.email, display_name=user.display_name)

@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return current_user
