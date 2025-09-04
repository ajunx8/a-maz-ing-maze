from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import Base, engine, SessionLocal
from models import Puzzle, Attempt
from pydantic import BaseModel
from typing import List
from puzzle_logic import validate_path, default_puzzles

app = FastAPI()


@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.query(Puzzle).count() == 0:
            db.add_all([
                Puzzle(name="Easy Maze", description="Small 5x5 grid"),
                Puzzle(name="Key & Door", description="Collect key, open door"),
                Puzzle(name="Portals!", description="Use portals to finish"),
            ])
            db.commit()


@app.get("/api/puzzles")
def get_puzzles(db: Session = Depends(get_db)):
    puzzles = db.query(Puzzle).all()
    return {"puzzles": [{"id": p.id, "name": p.name, "description": p.description} for p in puzzles]}


@app.get("/api/db-health")
def db_health(db: Session = Depends(get_db)):
    # Simple check that a query works
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


class AttemptIn(BaseModel):
    puzzle_id: int
    moves: List[str]


@app.post("/api/attempts")
def submit_attempt(payload: AttemptIn, db: Session = Depends(get_db)):
    puzzle = db.query(Puzzle).filter(Puzzle.id == payload.puzzle_id).first()
    if not puzzle:
        return {"ok": False, "detail": "Puzzle not found"}

    # Get grid by puzzle name from in-memory defaults for now
    grid = default_puzzles.get(puzzle.name)
    if not grid:
        return {"ok": False, "detail": "Puzzle grid not configured"}

    is_valid = validate_path(grid, payload.moves)

    attempt = Attempt(puzzle_id=puzzle.id, moves="".join(payload.moves), valid=is_valid)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return {"ok": True, "attempt_id": attempt.id, "valid": is_valid}
