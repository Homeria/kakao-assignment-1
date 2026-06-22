import os
from datetime import datetime
from typing import Literal, Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, field_validator
from sqlalchemy import Boolean, Column, DateTime, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

load_dotenv(".env.local")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
TodoFilter = Literal["all", "active", "completed"]


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, nullable=False, default=False)
    date = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)


class TodoCreate(BaseModel):
    title: str
    completed: bool = False
    date: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        trimmed_value = value.strip()
        if not trimmed_value:
            raise ValueError("Todo title is required.")
        return trimmed_value


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    date: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value

        trimmed_value = value.strip()
        if not trimmed_value:
            raise ValueError("Todo title is required.")
        return trimmed_value


class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    date: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Todo API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def find_todo_or_404(todo_id: int, db: Session) -> Todo:
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found.")
    return todo


@app.get("/todos", response_model=list[TodoResponse])
def get_todos(
    date: Optional[str] = None,
    todo_filter: TodoFilter = Query(default="all", alias="filter"),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Todo)

    if date is not None and date.strip():
        query = query.filter(Todo.date == date.strip())

    if todo_filter == "active":
        query = query.filter(Todo.completed.is_(False))
    elif todo_filter == "completed":
        query = query.filter(Todo.completed.is_(True))

    if search is not None and search.strip():
        query = query.filter(Todo.title.ilike(f"%{search.strip()}%"))

    return query.order_by(Todo.date.asc(), Todo.id.asc()).all()


@app.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo_create: TodoCreate, db: Session = Depends(get_db)):
    todo = Todo(
        title=todo_create.title,
        completed=todo_create.completed,
        date=todo_create.date,
    )

    db.add(todo)
    db.commit()
    db.refresh(todo)

    return todo


@app.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    return find_todo_or_404(todo_id, db)


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo_update: TodoUpdate, db: Session = Depends(get_db)):
    todo = find_todo_or_404(todo_id, db)
    update_data = todo_update.model_dump(exclude_unset=True)

    if "title" in update_data:
        if update_data["title"] is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Todo title cannot be empty.",
            )
        todo.title = update_data["title"]

    if "completed" in update_data:
        if update_data["completed"] is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Todo completed state cannot be empty.",
            )
        todo.completed = update_data["completed"]

    if "date" in update_data:
        todo.date = update_data["date"]

    db.commit()
    db.refresh(todo)

    return todo


@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = find_todo_or_404(todo_id, db)

    db.delete(todo)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
