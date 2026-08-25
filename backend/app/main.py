from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.models import User

from app.routers.auth import router as auth_router
from app.routers.dashboard import router as dashboard_router
from app.routers.expense import router as expense_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Accounting Assistant API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(expense_router)


@app.get("/")
def root():
    return {
        "message": "AI Accounting Assistant API is running"
    }