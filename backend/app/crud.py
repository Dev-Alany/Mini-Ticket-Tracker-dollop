from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas


def create_ticket(db: Session, payload: schemas.TicketCreate) -> models.Ticket:
    ticket = models.Ticket(**payload.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def list_tickets(
    db: Session,
    status: Optional[models.StatusEnum],
    page: int,
    limit: int,
) -> tuple[int, list[models.Ticket]]:
    q = db.query(models.Ticket)
    if status:
        q = q.filter(models.Ticket.status == status)
    total = q.count()
    items = (
        q.order_by(models.Ticket.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return total, items


def get_ticket(db: Session, ticket_id: int) -> Optional[models.Ticket]:
    return db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()


def update_ticket(
    db: Session, ticket: models.Ticket, payload: schemas.TicketUpdate
) -> models.Ticket:
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(ticket, field, value)
    db.commit()
    db.refresh(ticket)
    return ticket


def get_stats(db: Session) -> dict:
    rows = (
        db.query(models.Ticket.status, func.count(models.Ticket.id))
        .group_by(models.Ticket.status)
        .all()
    )
    counts = {r[0]: r[1] for r in rows}
    return {
        "open": counts.get(models.StatusEnum.open, 0),
        "in_progress": counts.get(models.StatusEnum.in_progress, 0),
        "closed": counts.get(models.StatusEnum.closed, 0),
    }
