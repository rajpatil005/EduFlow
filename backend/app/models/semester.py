from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Semester(Base):
    __tablename__ = "semesters"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    number: Mapped[int] = mapped_column(nullable=False)
    programme_id: Mapped[int] = mapped_column(
        ForeignKey("programmes.id"),
        nullable=False,
    )