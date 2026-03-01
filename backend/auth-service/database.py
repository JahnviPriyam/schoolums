from sqlmodel import SQLModel, create_engine

engine = create_engine("sqlite:///auth.db")

def create_db():
    SQLModel.metadata.create_all(engine)