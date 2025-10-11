"""
file having all teh schemas for our database tables
"""
from pydantic import BaseModel, Field
from typing import Generic, TypeVar
from datetime import datetime

# Todos
class TodoBase(BaseModel):
    title: str = Field(min_length=5, max_length=100)
    description: str = Field(min_length=10, max_length=500)
    priority: int = Field(default=3, le=3, ge=1)


class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    title: str | None = None
    description: str | None = None
    priority: int | None = Field(default=None, le=3, ge=1)
    completed: bool | None = None

class Todo(TodoBase):
    id: int
    owner_id: int
    completed: bool
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "A lunch break",
                "description": "A 30-minute break for lunch with family and friends",
                "priority": 3
            }
        },
        "from_attributes": True
    }

# Users
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    todos: list[Todo] = []


    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "johndoe@mail.com",
            }
        },
        "from_attributes": True
    }
T = TypeVar("T")

class Response(BaseModel, Generic[T]):
    status: str = "success"
    data: T

class ResponseList(BaseModel, Generic[T]):
    status: str = "success"
    results: int
    data: list[T]
