from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..models import StatusEnum
from ..database import get_db

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.post("/", response_model=schemas.TicketOut, status_code=201)
def create_ticket(payload: schemas.TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, payload)


@router.get("/stats", response_model=schemas.StatusStats)
def ticket_stats(db: Session = Depends(get_db)):
    return crud.get_stats(db)


@router.get("/", response_model=schemas.PaginatedTickets)
def list_tickets(
    status: Optional[StatusEnum] = Query(None, description="Filter by status"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    total, items = crud.list_tickets(db, status, page, limit)
    return schemas.PaginatedTickets(total=total, page=page, limit=limit, items=items)


@router.patch("/{ticket_id}", response_model=schemas.TicketOut)
def update_ticket(
    ticket_id: int,
    payload: schemas.TicketUpdate,
    db: Session = Depends(get_db),
):
    ticket = crud.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if not payload.model_dump(exclude_unset=True):
        raise HTTPException(status_code=400, detail="No fields provided to update")
    return crud.update_ticket(db, ticket, payload)
