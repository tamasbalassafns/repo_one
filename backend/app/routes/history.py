from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import HistoryEntry, HistoryEntryCreate, HistoryEntryRead

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=List[HistoryEntryRead])
def list_history(session: Session = Depends(get_session)):
    entries = session.exec(select(HistoryEntry).order_by(HistoryEntry.id.desc())).all()
    return entries


@router.post("", response_model=HistoryEntryRead, status_code=201)
def create_entry(entry: HistoryEntryCreate, session: Session = Depends(get_session)):
    db_entry = HistoryEntry.model_validate(entry)
    session.add(db_entry)
    session.commit()
    session.refresh(db_entry)
    return db_entry


@router.delete("/{entry_id}", status_code=204)
def delete_entry(entry_id: int, session: Session = Depends(get_session)):
    entry = session.get(HistoryEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    session.delete(entry)
    session.commit()
