from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, field_validator

TodoFilter = Literal["all", "active", "completed"]


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
