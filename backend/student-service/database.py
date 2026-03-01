from sqlmodel import SQLModel, create_engine

engine = create_engine("sqlite:///student.db")

def create_db():
    SQLModel.metadata.create_all(engine)