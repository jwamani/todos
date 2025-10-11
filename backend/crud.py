"""
this file handles all our database operations
"""
from models import Todo, User
from sqlalchemy.orm import Session
from schemas import TodoCreate, TodoUpdate, UserCreate
from security import generate_password_hash
from schemas import Todo as TodoSchema
from schemas import User as UserSchema

# TODO: update all cruds to handle exceptions and return standard objects

# all todos
def get_todos(db: Session, owner_id: int, skip: int = 0, limit: int = 50):
    return db.query(Todo).filter(Todo.owner_id == owner_id).offset(skip).limit(limit).all()


def get_todo(db: Session, todo_id: int, owner_id: int) -> Todo | None:
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.owner_id == owner_id).first()
    return todo


def create_todo(db: Session, todo: TodoCreate, owner_id: int):
    todo_created = Todo(**todo.model_dump(), owner_id=owner_id)
    db.add(todo_created)
    db.commit()
    db.refresh(todo_created)
    return todo_created


def update_todo(db: Session, todo: Todo, update_data: TodoUpdate) -> Todo:
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

# USER functions
def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    hashed_pwd: str = generate_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_pwd)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
