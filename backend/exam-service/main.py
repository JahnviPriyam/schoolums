from fastapi import FastAPI
from database import create_db
from routes import router

app = FastAPI(title="Exam Service")

@app.on_event("startup")
def on_startup():
    create_db()

app.include_router(router)
