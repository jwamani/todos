"""
This is for the routes and table creation
"""

from fastapi import FastAPI, status
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
from datetime import timedelta
from jose import JWTError, jwt

import models
from schemas import TodoCreate, TodoUpdate, User, Todo, UserCreate
from database import engine, get_db
from crud import get_todos, get_todo, get_user_by_email, create_todo, delete_todo, update_todo, create_user
from security import create_access_token, ALGO, KEY

load_dotenv()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

models.Base.metadata.create_all(bind=engine)  # ran once

EXPIRE_MINS = float(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
app = FastAPI()


# decoding function dependency
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    creds_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, KEY, algorithms=[ALGO])
        email: str = payload.get("subject")
        if email is None:
            raise creds_exception
    except JWTError:
        raise creds_exception

    user = get_user_by_email(db, email)
    if user is None:
        raise creds_exception
    return user


@app.get("/")
def read_root():
    return {"message": "Server up and running"}


# all todos
@app.get("/todos", response_model=list[Todo])
def read_todos(db: Session = Depends(get_db), skip: int = 0, limit: int = 50,
               current_user: User = Depends(get_current_user)):
    todos = get_todos(db, owner_id=current_user.id, skip=skip, limit=limit)
    if todos is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todos not found")
    return todos


@app.get("/todos/{todo_id}", response_model=Todo)
def read_todo(todo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    todo: Todo = get_todo(db, todo_id=todo_id, owner_id=current_user.id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo

@app.post("/todos", response_model=Todo)
def create_todo_(todo: TodoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_todo(db, todo, owner_id=current_user.id)

@app.put("/todos/{todo_id}")
def update_todo_(todo_id: int, todo_updates: TodoUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    todo = get_todo(db, todo_id=todo_id, owner_id=current_user.id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return update_todo(db, todo, todo_updates)

@app.delete("/todos/{todo_id}")
def delete_todo_(todo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    todo = get_todo(db, todo_id=todo_id, owner_id=current_user.id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    success = delete_todo(db, todo).get("success")
    return success

# login endpoint
@app.post("/token")
def login_for_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=EXPIRE_MINS)
    access_token = create_access_token(data={"subject": user.email}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users", response_model=User, status_code=status.HTTP_201_CREATED)
def create_new_user(user_data: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user_data.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db, user_data)

