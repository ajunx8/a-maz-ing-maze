from fastapi import FastAPI
import os
import psycopg2

app = FastAPI()


@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}


@app.get("/api/puzzles")
def get_puzzles():
    return {"puzzles": ["puzzle1", "puzzle2", "puzzle3"]}


@app.get("/api/db-health")
def db_health():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        return {"status": "error", "detail": "DATABASE_URL not set"}
    try:
        with psycopg2.connect(database_url) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
                cur.fetchone()
        return {"status": "ok"}
    except Exception as exc:  # pylint: disable=broad-except
        return {"status": "error", "detail": str(exc)}
