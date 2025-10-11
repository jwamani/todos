from datetime import datetime, timedelta, UTC
from jose import jwt, JWTError
from passlib.context import CryptContext
from passlib.hash import bcrypt_sha256
from dotenv import load_dotenv
import os

load_dotenv()

KEY = os.getenv("SECRET_KEY")
ALGO = os.getenv("ALGORITHM")
EXPIRE_MINS = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") has an issue

def verify_password(plain_passwd, hashed_passwd) -> bool:
    return bcrypt_sha256.verify(plain_passwd, hashed_passwd)

def generate_password_hash(password: str) -> str:
    return bcrypt_sha256.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, KEY, algorithm=ALGO)
    return encoded_jwt
