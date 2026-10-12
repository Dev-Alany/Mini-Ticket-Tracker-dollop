"""
Mini Ticket Tracker — Backend (FastAPI + PostgreSQL)
====================================================

A minimal REST API for managing support tickets.

Quick start
-----------

1.  Create and activate a virtual environment::

        python -m venv .venv
        # Windows
        .venv\\Scripts\\activate
        # macOS / Linux
        source .venv/bin/activate

2.  Install runtime dependencies::

        pip install -r requirements.txt

3.  Copy ``.env.example`` → ``.env`` and set your database URL::

        DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME

4.  Run the development server::

        uvicorn app.main:app --reload

    The API will be available at http://localhost:8000.
    Interactive docs: http://localhost:8000/docs

Running tests
-------------

1.  Install dev dependencies::

        pip install -r requirements-dev.txt

2.  Set the test database URL (a separate DB is recommended)::

        set TEST_DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/ticket_tracker_test

3.  Run pytest from the ``backend/`` directory::

        pytest tests/ -v
"""
