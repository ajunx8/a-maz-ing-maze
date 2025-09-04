# The Challenge

## Build a small application with the following components:
FastAPI backend – Create an API with a couple of endpoints. It should handle:
User registration/login (JWT or similar auth flow)
A “maze puzzle” endpoint where a user submits a path (set of moves) and the backend validates whether it reaches the goal.
Use OpenAPI/Swagger for documentation.

## PostgreSQL database – Store users, puzzles, and attempts (including whether the attempt was valid). Seed it with at least 2–3 puzzles.

## React frontend 
Show a list of puzzles.
Allow a user to “play” one (basic grid or simple interface).
Submit their moves to the backend and display the result.
Include a simple leaderboard or results page.

## Key Points
Make the puzzle logic fun: users must collect keys before opening doors, avoid walls, and can use portals.
Keep it simple, but ensure the logic works correctly on the server-side.
Add some testing (unit tests or component tests).
Please use Git and include a short README file explaining the setup, your approach, and where you utilised AI assistance (if applicable).

## What to Deliver
A GitHub (or similar) repo link with your code.
Instructions to run the project (Docker or simple setup scripts welcome).
We’re looking at:
How you structure and document your code.
How you approach problem-solving and puzzle logic.
How well you use FastAPI, PostgreSQL, React, and testing.

Please aim to complete as much of this as possible in advance of your final round interview. I will send out a calendar link to book a call with us for next week, providing an opportunity to showcase your work above.  If you need more time to implement the above, please let me know?

---

# Getting Started

## Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js 20+ and Python 3.13+ for local development

## Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd a-maze-ing-maze
   ```

2. **Start all services**
   ```bash
   docker compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:80
   - API Documentation: http://localhost:80/docs
   - Database: localhost:5432 (postgres/password)

4. **Stop the services**
   ```bash
   docker compose down
   ```

## Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend**
   ```bash
   fastapi run main.py --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
a-maze-ing-maze/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application file
│   ├── models.py           # Database models
│   ├── puzzle_logic.py     # Maze puzzle logic
│   ├── db.py              # Database configuration
│   └── tests/             # Backend tests
├── frontend/               # React frontend
│   ├── app/               # React Router v7 app
│   │   ├── routes/        # Page components
│   │   └── components/    # Reusable components
│   └── public/            # Static assets
└── docker-compose.yaml    # Docker services configuration
```

## API Endpoints

The backend provides the following main endpoints:

- `GET /api/hello` - Health check endpoint
- `GET /api/puzzles` - List available puzzles
- `GET /api/puzzles/{puzzle_id}/grid` - Get puzzle grid layout
- `POST /api/attempts` - Submit puzzle solution attempt
- `GET /api/db-health` - Database health check

Full API documentation is available at http://localhost:80/docs when running.

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Troubleshooting

### Docker Issues
- If ports are already in use, modify the port mappings in `docker-compose.yaml`
- To completely reset: `docker system prune -a --volumes`

### Database Issues
- Ensure PostgreSQL is running and accessible
- Check database credentials in environment variables
- Database will be automatically seeded with sample puzzles on first run

### Development Issues
- Backend runs on port 80 (Docker) or default FastAPI port (local)
- Frontend runs on port 5173
- Ensure all services are running before testing the full application

---
