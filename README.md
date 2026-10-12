# Mini Ticket Tracker

A lightweight support ticket management app built with **React**, **FastAPI**, and **PostgreSQL**.

---

## Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Frontend | React 19 + Vite                 |
| Backend  | Python 3.12 · FastAPI · Uvicorn |
| Database | PostgreSQL 16 · SQLAlchemy ORM  |

---

## Setup & Run

### Prerequisites

- Python 3.10+
- Node.js 18+
- A running PostgreSQL instance

---

### 1 — Database

Create two databases (one for dev, one for tests):

```sql
CREATE DATABASE ticket_tracker;
CREATE DATABASE ticket_tracker_test;
```

---

### 2 — Backend

```bash
cd backend

# create and activate venv
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# install runtime deps
pip install -r requirements.txt

# copy env and set your DB credentials
cp .env.example .env
# edit .env → set DATABASE_URL

# run the server (auto-creates tables on first start)
uvicorn app.main:app --reload
```

API available at **http://localhost:8000**  
Interactive docs: **http://localhost:8000/docs**

---

### 3 — Frontend

```bash
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:8000
npm install
npm run dev
```

UI available at **http://localhost:5173**

---

### 4 — Running Tests

```bash
cd backend
pip install -r requirements-dev.txt

# set test DB (Windows)
set TEST_DATABASE_URL=postgresql://postgres:password@localhost:5432/ticket_tracker_test

pytest tests/ -v
```

---

## API Reference

| Method | Endpoint            | Description                              |
|--------|---------------------|------------------------------------------|
| POST   | `/tickets/`         | Create a ticket                          |
| GET    | `/tickets/`         | List tickets (`?status=`, `?page=`, `?limit=`) |
| PATCH  | `/tickets/{id}`     | Update status or priority                |
| GET    | `/tickets/stats`    | Ticket counts grouped by status          |
| GET    | `/health`           | Health check                             |

---

## Decisions & Tradeoffs

**SQLAlchemy over raw SQL** — ORM gives me the enum mapping and session management for free, and for a project this size the query overhead is negligible. With more time I'd add Alembic migrations instead of relying on `create_all`.

**`create_all` on startup** — Simple for the assignment; a real service would use Alembic so schema changes are tracked and reversible.

**No auth** — Adding JWT or session auth was out of scope for a 3–4 hour task. In production every write endpoint would require authentication and a permissions check.

**Single-page React UI** — The spec explicitly said "a single page is fine," so I kept routing out. Next step would be React Router with a detail view per ticket.

**In-process pagination** — Pagination is handled at the DB level (OFFSET/LIMIT), which is correct for moderate data volumes. For very large tables a cursor-based approach would perform better.

**Test isolation via rollback** — Each test function runs inside a transaction that is rolled back at the end, keeping tests fast and independent without truncating tables between runs.

**No Alembic / no Docker Compose** — Skipped to stay within the time budget. A production setup would ship a `docker-compose.yml` and Alembic migration scripts so any contributor can `docker compose up` and be running in minutes.
