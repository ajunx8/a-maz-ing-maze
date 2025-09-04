from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import Base, engine, SessionLocal
from models import Puzzle

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
