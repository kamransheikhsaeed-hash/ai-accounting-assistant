from pydantic import BaseModel
from datetime import date

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    expense_date: date


class ExpenseUpdate(BaseModel):
    title: str
    amount: float
    category: str
    expense_date: date