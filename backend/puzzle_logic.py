from typing import Dict, List, Set, Tuple


Grid = List[str]


def _find_positions(grid: Grid) -> Tuple[Tuple[int, int], Tuple[int, int]]:
    start = (-1, -1)
    goal = (-1, -1)
    for r, row in enumerate(grid):
        for c, ch in enumerate(row):
            if ch == "S":
                start = (r, c)
            elif ch == "G":
                goal = (r, c)
    return start, goal


def _portal_pairs(grid: Grid) -> Dict[str, List[Tuple[int, int]]]:
    pairs: Dict[str, List[Tuple[int, int]]] = {}
    for r, row in enumerate(grid):
        for c, ch in enumerate(row):
            if ch.isalpha() and ch not in {"S", "G"}:
                pairs.setdefault(ch, []).append((r, c))
    return pairs


def _move(pos: Tuple[int, int], dir_ch: str) -> Tuple[int, int]:
    r, c = pos
    if dir_ch == "U":
        return r - 1, c
    if dir_ch == "D":
        return r + 1, c
    if dir_ch == "L":
        return r, c - 1
    if dir_ch == "R":
        return r, c + 1
    return pos


def validate_path(grid: Grid, moves: List[str]) -> bool:
    start, goal = _find_positions(grid)
    if start == (-1, -1) or goal == (-1, -1):
        return False

    portal_map = _portal_pairs(grid)
    keys: Set[str] = set()
    r, c = start

    rows = len(grid)
    cols = len(grid[0]) if rows else 0

    for step in moves:
        nr, nc = _move((r, c), step)
        # bounds
        if nr < 0 or nr >= rows or nc < 0 or nc >= cols:
            return False
        tile = grid[nr][nc]
        # walls
        if tile == "#":
            return False
        # door requires key of same lowercase letter (e.g., 'D' needs 'd')
        if tile.isupper() and tile not in {"S", "G"}:
            needed = tile.lower()
            if needed not in keys:
                return False
        # collect key
        if tile.islower():
            keys.add(tile)
        # portal: teleport to the other instance of same letter
        if tile.isalpha() and tile not in {"S", "G"}:
            locs = portal_map.get(tile, [])
            if len(locs) == 2:
                if (nr, nc) == locs[0]:
                    nr, nc = locs[1]
                else:
                    nr, nc = locs[0]

        r, c = nr, nc

    return (r, c) == goal


# Simple reference grids for seeded puzzles
default_puzzles: Dict[str, Grid] = {
    "Easy Maze": [
        "S...",
        ".##.",
        "....",
        "...G",
    ],
    "Key & Door": [
        "S.d.",
        ".#D#",
        "....",
        "..G.",
    ],
    "Portals!": [
        "S.A.",
        "##.#",
        ".A.G",
        "....",
    ],
}
