import os, sys; sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from puzzle_logic import validate_path, default_puzzles


def test_easy_maze_valid():
    grid = default_puzzles["Easy Maze"]
    assert validate_path(grid, list("RRRDDD")) is True


def test_easy_maze_invalid_wall():
    grid = default_puzzles["Easy Maze"]
    assert validate_path(grid, list("RRDDRR")) is False


def test_key_and_door_requires_key():
    grid = default_puzzles["Key & Door"]
    # Try to pass door 'D' without key 'd'
    assert validate_path(grid, list("RRR")) is False


def test_portal_teleports():
    grid = default_puzzles["Portals!"]
    # Step onto A at (0,2) then should teleport to the other 'A'
    assert validate_path(grid, list("RR")) is False  # not at goal yet
