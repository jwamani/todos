from datetime import datetime, timedelta, UTC
from jose import jwt, JWTError
from passlib.context import CryptContext
from passlib.hash import bcrypt_sha256
from dotenv import load_dotenv
import os
from typing import Optional

load_dotenv()

KEY = os.getenv("SECRET_KEY", os.urandom(32))
ALGO = os.getenv("ALGORITHM", "HS256")
EXPIRE_MINS = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")


pwd_context = CryptContext(schemes=["argon2"], deprecated="auto") # bcrypt has an issue

def verify_password(plain_passwd, hashed_passwd) -> bool:
    return pwd_context.verify(plain_passwd, hashed_passwd)

def generate_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, KEY, algorithm=ALGO)
    return encoded_jwt
