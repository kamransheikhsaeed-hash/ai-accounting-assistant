from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/")
def add_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    new_expense = Expense(
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        expense_date=expense.expense_date,
        user_id=1
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return {
        "message": "Expense added successfully",
        "expense_id": new_expense.id
    }