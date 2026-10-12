from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import tickets

# Create tables on startup (dev convenience — use Alembic in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mini Ticket Tracker", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tickets.router)


@app.get("/health")
def health():
    return {"status": "ok"}
