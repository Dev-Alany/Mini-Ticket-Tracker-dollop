"""
Integration tests — run against a real (test) PostgreSQL database.
Set TEST_DATABASE_URL in your env or .env.test before running.

    pytest tests/
"""
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use a separate test DB
TEST_DB_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/ticket_tracker_test",
)

os.environ["DATABASE_URL"] = TEST_DB_URL  # must be set before importing app

from app.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402

engine = create_engine(TEST_DB_URL)
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSession(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class TestCreateTicket:
    def test_creates_ticket_with_defaults(self, client):
        resp = client.post("/tickets/", json={"title": "Login page broken"})
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "Login page broken"
        assert data["status"] == "open"
        assert data["priority"] == "medium"
        assert "id" in data
        assert "created_at" in data

    def test_creates_ticket_with_all_fields(self, client):
        resp = client.post(
            "/tickets/",
            json={
                "title": "DB migration failing",
                "description": "Alembic throws on step 003",
                "status": "in_progress",
                "priority": "high",
            },
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["priority"] == "high"
        assert data["status"] == "in_progress"

    def test_rejects_blank_title(self, client):
        resp = client.post("/tickets/", json={"title": "   "})
        assert resp.status_code == 422

    def test_rejects_missing_title(self, client):
        resp = client.post("/tickets/", json={"description": "no title"})
        assert resp.status_code == 422


class TestListTickets:
    def test_returns_paginated_response(self, client):
        client.post("/tickets/", json={"title": "Ticket A"})
        client.post("/tickets/", json={"title": "Ticket B"})
        resp = client.get("/tickets/?page=1&limit=10")
        assert resp.status_code == 200
        data = resp.json()
        assert "total" in data
        assert "items" in data
        assert data["page"] == 1
        assert data["limit"] == 10

    def test_status_filter(self, client):
        client.post("/tickets/", json={"title": "Open one", "status": "open"})
        client.post("/tickets/", json={"title": "Closed one", "status": "closed"})
        resp = client.get("/tickets/?status=closed")
        assert resp.status_code == 200
        items = resp.json()["items"]
        assert all(t["status"] == "closed" for t in items)


class TestUpdateTicket:
    def test_updates_status(self, client):
        created = client.post("/tickets/", json={"title": "Fix auth"}).json()
        resp = client.patch(f"/tickets/{created['id']}", json={"status": "closed"})
        assert resp.status_code == 200
        assert resp.json()["status"] == "closed"

    def test_updates_priority(self, client):
        created = client.post("/tickets/", json={"title": "Perf issue"}).json()
        resp = client.patch(f"/tickets/{created['id']}", json={"priority": "high"})
        assert resp.status_code == 200
        assert resp.json()["priority"] == "high"

    def test_404_on_missing_ticket(self, client):
        resp = client.patch("/tickets/999999", json={"status": "closed"})
        assert resp.status_code == 404

    def test_400_on_empty_patch(self, client):
        created = client.post("/tickets/", json={"title": "Empty patch"}).json()
        resp = client.patch(f"/tickets/{created['id']}", json={})
        assert resp.status_code == 400


class TestStats:
    def test_stats_returns_all_statuses(self, client):
        client.post("/tickets/", json={"title": "S1", "status": "open"})
        client.post("/tickets/", json={"title": "S2", "status": "in_progress"})
        client.post("/tickets/", json={"title": "S3", "status": "closed"})
        resp = client.get("/tickets/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert "open" in data
        assert "in_progress" in data
        assert "closed" in data
        assert data["open"] >= 1
        assert data["in_progress"] >= 1
        assert data["closed"] >= 1

    def test_stats_counts_are_integers(self, client):
        resp = client.get("/tickets/stats")
        assert resp.status_code == 200
        data = resp.json()
        for key in ("open", "in_progress", "closed"):
            assert isinstance(data[key], int)
