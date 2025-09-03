from fastapi import FastAPI

app = FastAPI()


@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}


@app.get("/api/puzzles")
def get_puzzles():
    return {"puzzles": ["puzzle1", "puzzle2", "puzzle3"]}
