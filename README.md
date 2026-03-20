School UMS (Student Management System)

A full-stack Student Management System built using React, FastAPI, Docker, and Microservices Architecture.
The system simulates a real-world school environment where teachers manage students and attendance, while students can view their own records.

🚀 Current Features (Implemented)
🔐 Authentication (Auth Service)

User registration and login

JWT-based authentication

Role-based access (Teacher / Student)

👩‍🏫 Teacher Features

Add students

View students

Delete students

Mark attendance (present/absent)

View attendance records

Dashboard analytics:

Total students

Present today

Absent today

Attendance percentage

🎓 Student Features

Secure login

View personal attendance

Basic dashboard overview

📊 Attendance System

Date-wise attendance marking

Prevents duplicate entries

Stores attendance history

Role-restricted access

🧱 Architecture

Microservices-based backend:

Auth Service

Student Service

API Gateway

API Gateway routes requests to services

Services communicate via HTTP

🛠 Tech Stack
Frontend

React + TypeScript

Vite

Tailwind CSS

Shadcn UI

Backend

FastAPI

SQLModel (ORM)

SQLite

Infrastructure

Docker & Docker Compose

⚙️ Key Features

JWT Authentication

Role-Based Access Control

API Gateway Routing

Dockerized Multi-Service Setup

Clean UI with modern components

🧪 How to Run
docker compose build
docker compose up
🌐 Access

Frontend:
http://localhost:8080

API Gateway:
http://127.0.0.1:9000/docs

Auth Service:
http://127.0.0.1:8000/docs

📁 Project Structure
frontend/
auth-service/
student-service/
api-gateway/
docker-compose.yml
📌 Current Status

✔ Authentication system complete
✔ Student management complete
✔ Attendance system complete
✔ Teacher dashboard complete
✔ Student dashboard basic version complete
✔ Microservices architecture implemented
✔ Docker setup working

🔮 Planned Features (In Progress)

The following modules are planned to enhance the system:

📘 Exams Module

Add and manage student marks

View marks (teacher & student)

Subject-wise performance tracking

🗓 Timetable Module

Create class schedules

View timetable (teacher & student)

Manage daily routines

📈 Advanced Student Dashboard

Total classes attended

Present/absent breakdown

Attendance percentage insights

🤖 Future Enhancements

Academic risk prediction system

Chatbot support

Cloud deployment (AWS)

Improved UI/UX

💡 Design Decisions

Used microservices to separate concerns (auth vs student logic)

Implemented API Gateway for scalability

Used JWT for stateless authentication

Chose Docker for easy deployment and reproducibility

👩‍💻 Author

Jahnvi Priyam
B.Tech CSE (2027)