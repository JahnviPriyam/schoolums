import os
from sqlmodel import SQLModel, create_engine

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///auth.db")
engine = create_engine(DATABASE_URL)

def create_db():
    SQLModel.metadata.create_all(engine)