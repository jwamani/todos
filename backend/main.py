"""
This is for the routes and table creation
"""
from fastapi import FastAPI, status
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
from datetime import timedelta
from jose import JWTError, jwt
from typing import Annotated
import logging
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

import models
from schemas import TodoCreate, TodoUpdate, User, Todo, UserCreate, Response, ResponseList
from database import engine, get_db
from crud import get_todos, get_todo, get_user_by_email, create_todo, delete_todo, update_todo, create_user
from security import create_access_token, ALGO, KEY, verify_password

logging.basicConfig(level=logging.INFO, filename="./db_logs.log", filemode="a", 
                    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

load_dotenv()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

models.Base.metadata.create_all(bind=engine)  # ran once

EXPIRE_MINS = float(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

app = FastAPI(title="Todo Backend API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

logger.info("Backend API started")
# exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    logger.error(f"Database Integrity error: {str(exc.orig)}")
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": str(exc.orig).lower()}
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_execption_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {type(exc).__name__} - {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "Database service temporarily unavailable. Please try again later"}
    )

@app.exception_handler(Exception)
async def general_execution_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {type(exc).__name__} - {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occcured. Please contact support."}
    )


# decoding function dependency
def get_current_user( db: Annotated[Session, Depends(get_db)], token: Annotated[str, Depends(oauth2_scheme)]):
    creds_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, KEY, algorithms=[ALGO])
        email: str = payload.get("subject", "")
        if email is None:
            raise creds_exception
    except JWTError:
        raise creds_exception

    user = get_user_by_email(db, email)
    if user is None:
        raise creds_exception
    return user


@app.get("/", status_code=status.HTTP_200_OK)
async def read_root():
    return {"message": "Server up and running"}


# all todos
@app.get("/todos", response_model=ResponseList[Todo], status_code=status.HTTP_200_OK)
async def read_todos(db: Annotated[Session, Depends(get_db)], current_user: Annotated[User, Depends(get_current_user)],skip: int = 0, limit: int = 50):
    todos = get_todos(db, owner_id=current_user.id, skip=skip, limit=limit)
    return {"results": len(todos), "data": todos}


@app.get(
    "/todos/{todo_id}", response_model=Response[Todo], status_code=status.HTTP_200_OK
)
async def read_todo(
    todo_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    todo: Todo = get_todo(db, todo_id=todo_id, owner_id=current_user.id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Todo with id {todo_id} not found")
    return {"data": todo}


@app.post("/todos", response_model=Response[Todo], status_code=status.HTTP_201_CREATED)
async def create_todo_(
    todo: TodoCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    todo = create_todo(db, todo, owner_id=current_user.id)
    return {"data": todo}


@app.put(
    "/todos/{todo_id}", response_model=Response[Todo], status_code=status.HTTP_200_OK
)
async def update_todo_(
    todo_id: int,
    todo_updates: TodoUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    todo = get_todo(db, todo_id=todo_id, owner_id=current_user.id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    todo =  update_todo(db, todo, todo_updates)
    return {"data": todo}


@app.delete("/todos/{todo_id}", status_code=status.HTTP_200_OK)
async def delete_todo_(
    todo_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    todo = get_todo(db, todo_id=todo_id, owner_id=current_user.id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    delete_todo(db, todo)
    return {"status": "success", "message": f"Todo with id {todo_id} deleted"}


# login endpoint
@app.post("/token", status_code=status.HTTP_200_OK)
async def login_for_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)]):
    user = get_user_by_email(db, email=form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=EXPIRE_MINS)
    access_token = create_access_token(data={"subject": user.email}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/users", response_model=Response[User], status_code=status.HTTP_201_CREATED)
async def create_new_user(
    user_data: UserCreate, db: Annotated[Session, Depends(get_db)]):
    db_user = get_user_by_email(db, email=user_data.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    created = create_user(db, user_data)
    return {"data": created}
