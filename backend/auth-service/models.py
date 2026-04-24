from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    role: str
    created_at: datetime
    password_updated_at: datetime = Field(default_factory=datetime.utcnow)
    requires_password_change: bool = Field(default=False)
    avatar_id: int = Field(default=1)
    preferred_language: str = Field(default="en")