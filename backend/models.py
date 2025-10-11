from sqlalchemy import Boolean, Integer, Column, String, DATETIME, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Todo(Base):
    __tablename__ = "todos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), index=True)
    description = Column(String(500))
    completed = Column(Boolean, default=False)
    priority = Column(Integer, default=3) # 1 to 3
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="todos")

    created_at = Column(DATETIME(timezone=True), server_default=func.now())
    updated_at = Column(DATETIME(timezone=True), onupdate=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
            "priority": self.priority,
        }

class User(Base):
    __tablename__ =  "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), index=True, unique=True)
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)

    todos = relationship("Todo", back_populates="owner")