from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)


class Puzzle(Base):
    __tablename__ = "puzzles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)


class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    puzzle_id = Column(Integer, ForeignKey("puzzles.id"), nullable=False)
    moves = Column(String, nullable=False)
    valid = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    puzzle = relationship("Puzzle")
