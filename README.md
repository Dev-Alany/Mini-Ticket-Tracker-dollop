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


