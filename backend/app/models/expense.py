from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from app.db.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    expense_date = Column(Date, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))