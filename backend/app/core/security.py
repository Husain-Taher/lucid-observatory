from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Any, Dict
from jose import jwt, JWTError
from passlib.context import CryptContext
import ipaddress
import socket
import re
from urllib.parse import urlparse
from fastapi import HTTPException, status
from app.core.config import settings

import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8')[:72], hashed_password.encode('utf-8'))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8')[:72], salt).decode('utf-8')

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

# SSRF Guard for submitted claim URLs
def validate_url_safe(url: str) -> bool:
    """
    Blocks private IP ranges, loopback, cloud metadata endpoints,
    and non-http/https schemes to prevent SSRF vulnerabilities.
    """
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        hostname = parsed.hostname
        if not hostname:
            return False
            
        # Check against prohibited hostnames
        if hostname.lower() in ("localhost", "127.0.0.1", "::1", "metadata.google.internal"):
            return False
            
        # Resolve hostname to IP
        ip_str = socket.gethostbyname(hostname)
        ip = ipaddress.ip_address(ip_str)
        
        # Deny private, loopback, link-local, multicast, or reserved ranges
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_multicast or ip.is_reserved:
            return False
            
        return True
    except Exception:
        return False

# Prompt Injection and Guardrail Defense
SUSPICIOUS_PROMPT_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|prior)\s+instructions",
    r"system\s+prompt",
    r"you\s+are\s+now\s+(an\s+unfiltered|in\s+developer\s+mode)",
    r"<script>",
    r"javascript:",
    r"drop\s+table",
]

def sanitize_claim_input(text: str) -> str:
    """
    Validates that user claim text does not contain prompt-injection triggers
    or malicious execution tokens.
    """
    for pattern in SUSPICIOUS_PROMPT_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Claim text contains prohibited prompt-override or injection patterns."
            )
    return text.strip()
