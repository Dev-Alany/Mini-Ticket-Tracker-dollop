from typing import Optional
from pydantic import BaseModel, field_validator
from datetime import datetime
from .models import StatusEnum, PriorityEnum


class TicketCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: StatusEnum = StatusEnum.open
    priority: PriorityEnum = PriorityEnum.medium

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title cannot be blank")
        return v.strip()


class TicketUpdate(BaseModel):
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None


class TicketOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: StatusEnum
    priority: PriorityEnum
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedTickets(BaseModel):
    total: int
    page: int
    limit: int
    items: list[TicketOut]


class StatusStats(BaseModel):
    open: int
    in_progress: int
    closed: int
