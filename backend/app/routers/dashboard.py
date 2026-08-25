from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.models.expense import Expense
from app.models.user import User
from app.core.security import get_current_user


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expenses = db.query(Expense).filter(
        Expense.user_id == current_user.id
    ).all()

    total_expenses = len(expenses)

    total_amount = sum(
        expense.amount for expense in expenses
    )

    category_totals = {}

    for expense in expenses:
        category = expense.category

        if category not in category_totals:
            category_totals[category] = 0

        category_totals[category] += expense.amount

    recent_expenses = [
        {
            "id": expense.id,
            "title": expense.title,
            "amount": expense.amount,
            "category": expense.category,
            "expense_date": expense.expense_date
        }
        for expense in expenses[-5:]
    ]

    return {
        "user_id": current_user.id,
        "total_expenses": total_expenses,
        "total_amount": total_amount,
        "category_totals": category_totals,
        "recent_expenses": recent_expenses
    }