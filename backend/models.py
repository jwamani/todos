from sqlalchemy import Boolean, Integer, Column, String
from database import Base

class Todo(Base):
    __tablename__ = "todos"
    
    id = Column(Integer, primarykey=True, index=True)
    title = Column(String(100), index=True)
    description = Column(String(500))
    completed = Column(Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
        }