"""
This is for the routes and table creation
"""
import models
from database import engine
from fastapi import FastAPI

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Server up and running"}

# @app.
