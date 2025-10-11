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


def get_todo(db: Session, todo_id: int, owner_id: int) -> TodoSchema | None:
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.owner_id == owner_id).first()
    if todo:
        return TodoSchema.model_validate(todo)
    return None


def create_todo(db: Session, todo: TodoCreate, owner_id: int):
    todo_created = Todo(**todo.model_dump(), owner_id=owner_id)
    db.add(todo_created)
    db.commit()
    db.refresh(todo_created)
    return todo_created



def update_todo(db: Session, todo: Todo, update_data: TodoUpdate):
    updated_data = update_data.model_dump(exclude_unset=True)

    try:
        for k, v in updated_data.items():
            setattr(todo, k, v)
        db.add(todo)
        db.commit()
        db.refresh(todo)
        return todo
    except Exception as e:
        db.rollback()
        return {"success": False, "message": f"Failed to update item: {str(e)}", }


def delete_todo(db: Session, todo: Todo):
    try:
        db.delete(todo)
        db.commit()
        return {"success": True, "message": "Item deleted successfully"}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e), "message": f"Failed to delete item: {str(e)}"}


# USER functions
def get_user_by_email(db: Session, email: str) -> UserSchema | None:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return UserSchema.model_validate(user)
    return None


def create_user(db: Session, user: UserCreate):
    print(f"ATTEMPTING TO HASH PASSWORD: '{user.password}'")
    print(f"TYPE OF PASSWORD: {type(user.password)}")
    print(f"LENGTH OF PASSWORD: {len(user.password)}")
    hashed_pwd: str = generate_password_hash(user.password)
    user_ = User(email=user.email, hashed_password=hashed_pwd)
    try:
        db.add(user_)
        db.commit()
        db.refresh(user_)

        return {"user": user_}
    except Exception as e:
        db.rollback()
        return {"user": None, "message": f"Failed to create user: {str(e)}"}
