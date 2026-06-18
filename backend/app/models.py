from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel


class HistoryEntryBase(SQLModel):
    expression: str
    result: str


class HistoryEntry(HistoryEntryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class HistoryEntryCreate(HistoryEntryBase):
    pass


class HistoryEntryRead(HistoryEntryBase):
    id: int
    created_at: datetime
