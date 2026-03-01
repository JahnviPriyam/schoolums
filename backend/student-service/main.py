from fastapi import FastAPI
import models
from database import create_db
from routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Student Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_db()

app.include_router(router)