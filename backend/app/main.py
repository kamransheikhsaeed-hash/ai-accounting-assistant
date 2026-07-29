from fastapi import FastAPI
from app.db.database import Base, engine
from app.models import User
from app.routers.auth import router as auth_router
from app.routers.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Accounting Assistant API")

app.include_router(auth_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"message": "AI Accounting Assistant API is running"}