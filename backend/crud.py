"""
this file handles all our database operations
"""
from models import Todo, User
from sqlalchemy.orm import Session
from schemas import TodoCreate, TodoUpdate, UserCreate

# all todos TODO: add the owner_id filtering after auth
def get_todos(db: Session, skip: int = 0, limit: int = 50):
    return db.query(Todo).offset(skip).limit(limit).all()

def get_todo(db: Session, todo_id: int):
    return db.query(Todo).filter(Todo.id == todo_id).first()

# TODO: implement the todo with pydantic schema
def create_todo(db: Session, todo: TodoCreate, owner_id):
    todo_create = Todo(**todo.model_dump(), owner_id=owner_id)
    db.add(todo_create)
    db.commit()
    db.refresh(todo_create)
    return todo_create

# TODO: update function with pydantic schema
def update_todo(db: Session, todo: Todo, update_data: TodoUpdate):
    updated_data = update_data.model_dump(exclude_unset=True)
    for k, v in updated_data.items():
        setattr(todo, k, v)

    db.add(todo)
    db.commit()
    db.refresh(todo)

    return todo

def delete_todo(db: Session, todo: Todo):
    db.delete(todo)
    db.commit()
    return {"success": True}

# USER functions
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    user = User(**user.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)

    return user