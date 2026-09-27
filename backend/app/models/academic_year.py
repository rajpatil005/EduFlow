from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base

class AcademicYear(Base):
    __tablename__ = "academic_years"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    start_year: Mapped[int] = mapped_column(nullable=False)
    end_year: Mapped[int] = mapped_column(nullable=False)
