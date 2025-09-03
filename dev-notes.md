### Design Parts
- what are the steps to setup the dev environment for a full web application. The source code should be in github, it should be easily setup and ran in docker, it contains a postgres db, a react frontend and pythong (fastAPI) backend. Give a short brief on the steps and the tools I should use. It's a toy project, i.e very simple project.

Of course! Here's a concise guide to setting up a full-stack development environment using FastAPI, React, PostgreSQL, and Docker, all managed with Git and GitHub.

Core Tools 🛠️
    Git & GitHub: For version control and hosting your source code.
    Docker & Docker Compose: To containerize your services (frontend, backend, database) and run them together easily.
    Node.js & npm: To create and manage your React frontend.
    Python: For your FastAPI backend.

Step 1: Project Structure & GitHub
First, create a project folder and set up your Git repository. This structure keeps your services organized.
    Create Directories:

    mkdir my-project
    cd my-project
    mkdir backend frontend

    Initialize Git:

    git init
    touch .gitignore

Create a Repository on GitHub: Go to GitHub, create a new repository, and then link it to your local project and push.

    # Add the remote URL from GitHub
    git remote add origin <YOUR_GITHUB_REPO_URL>
    # Make your first commit and push
    git add .
    git commit -m "Initial project structure"
    git push -u origin main

    Populate .gitignore: Add common files to ignore.

    # Python
    __pycache__/
    *.pyc
    venv/

    # Node
    node_modules/
    build/
    .env.local

    # Docker
    docker-compose.override.yml

Step 2: Backend (FastAPI)

Inside the backend folder, set up your Python API.

    Create Files: In the backend directory, create the following files:

        main.py: Your FastAPI application code.

        requirements.txt: To list Python dependencies.

        Dockerfile: Instructions to build the Docker image.

    Code Examples:

        main.py: A simple API endpoint.
        Python

from fastapi import FastAPI

app = FastAPI()

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}

requirements.txt:

fastapi
uvicorn[standard]
psycopg2-binary # For connecting to Postgres

Dockerfile:
Dockerfile

        # Use an official Python runtime as a parent image
        FROM python:3.9-slim

        # Set the working directory
        WORKDIR /app

        # Copy the dependencies file and install them
        COPY requirements.txt .
        RUN pip install --no-cache-dir -r requirements.txt

        # Copy the rest of the application code
        COPY . .

        # Expose the port the app runs on and start the app
        EXPOSE 8000
        CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

Step 3: Frontend (React)

Inside the frontend folder, create your React app.

    Initialize React App: Run this command from the root of your project.


npx create-react-app frontend

Create a Dockerfile: Inside the newly created frontend directory, add a Dockerfile.
Dockerfile

# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port and start the development server
EXPOSE 3000
CMD ["npm", "start"]

Proxy API Requests: To allow the React app (on port 3000) to talk to the API (on port 8000) without CORS issues in development, add this line to your frontend/package.json:
JSON

    "proxy": "http://backend:8000"

    Note: backend here is the service name we'll define in Docker Compose.

Step 4: Database & Orchestration (Docker Compose)

This is the key step that ties everything together. Create a docker-compose.yml file in your project's root directory.

    docker-compose.yml:
    YAML

    version: '3.8'

    services:
      # Backend Service (FastAPI)
      backend:
        build: ./backend
        ports:
          - "8000:8000"
        volumes:
          - ./backend:/app # Sync local code with container for live updates
        environment:
          # Pass database credentials to the backend
          - DATABASE_URL=postgresql://user:password@db:5432/mydatabase
        depends_on:
          - db

      # Frontend Service (React)
      frontend:
        build: ./frontend
        ports:
          - "3000:3000"
        volumes:
          - ./frontend:/app # Sync local code with container
        stdin_open: true # Keeps the container running for React's dev server
        tty: true

      # Database Service (PostgreSQL)
      db:
        image: postgres:14
        volumes:
          - postgres_data:/var/lib/postgresql/data/ # Persist data
        environment:
          - POSTGRES_USER=user
          - POSTGRES_PASSWORD=password
          - POSTGRES_DB=mydatabase
        ports:
          - "5432:5432" # Expose DB port to your host machine (optional)

    volumes:
      postgres_data:

Step 5: Run Everything! 🚀

With all the files in place, you can now build and run your entire application with a single command from your project's root directory.

docker-compose up --build

    Your React app will be available at http://localhost:3000.

    Your FastAPI backend will be running on http://localhost:8000.

    Your PostgreSQL database will be accessible on port 5432.

Now you can develop your application, and any changes you make to the code on your local machine will be reflected inside the containers automatically thanks to the volumes we defined.

 1. React template: `npx create-react-router@latest my-react-router-app`

2. How to testing this frontend? 
  - recommended by copilot
    - jest
    - @types/jest
    - @testing-library/react
    - @testing-library/jest-dom
    - @testing-library/user-event
    - jest-environment-jsdom

  - recommended by testing-library docs
    - @testing-library/react 
    - @testing-library/dom       // ai says
    - @types/react 
    - @types/react-dom

  - recommended by jest
    - jest 
    - babel-jest
    - @babel/preset-env 
    - @babel/preset-react 
    - react-test-renderer

  - Inspo from https://github.com/epicweb-dev/epic-stack
    - use Vitest instead of jest
    - ai says:
      - vitest
      - vitest/ui (nice ui for test results)
      - @testing-library/react
      - @testing-library/jest-dom
  
  - recommended from https://github.com/alan2207/bulletproof-react
    - vitest
    - happy-dom (instead of jsdom)

- Backend: FastAPI docker setup
  - https://fastapi.tiangolo.com/deployment/docker/#one-process-per-container