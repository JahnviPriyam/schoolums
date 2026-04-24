from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import create_db
from routes import router

app = FastAPI(title="Student Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_db()

# 🔥 THIS LINE WAS MISSING
app.include_router(router)