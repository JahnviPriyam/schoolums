# SchoolUMS

A microservice-based School Management System built with:

- FastAPI (Auth Service)
- FastAPI (Student Service)
- API Gateway (FastAPI + httpx)
- React + Vite Frontend
- SQLite
- Docker & Docker Compose

---

## Architecture

Frontend → API Gateway → Microservices  
- Auth Service (Port 8000)
- Student Service (Port 8001)
- Gateway (Port 9000)

---

## Run Locally

docker compose up --build

Frontend: http://localhost:8080  
API Gateway: http://localhost:9000

---

## Features

- Role-based authentication (Teacher / Student)
- Teachers can create students
- Students can view their own profile
- Dockerized microservice architecture