<div align="center">

# 🎓 SchoolDesk MS (Management System)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**A premium, microservices-based, highly scalable Student & Teacher Management System.**
Features dynamic role-based dashboards, integrated AI assistant, glassmorphism UI, and bulletproof JWT authentication.

---

</div>

## 🌟 Key Features

### 👩‍🏫 Teacher Portal
- **Intelligent Dashboard:** Real-time analytics, active class counts, and quick insights.
- **Roster & Student Management:** One-click student onboarding with auto-generated secure credentials.
- **Grades & Assessment:** Robust marks upserting, grade reports, and native exam tracking.
- **Attendance Ledger:** Comprehensive daily attendance logging with visual charts.
- **Conflict-Free Timetables:** Assign subjects to timeslots with intelligent overlap prevention.
- **AI Chatbot Integration:** Built-in floating AI assistant to help teachers navigate the platform.
- **Global Settings:** Multilingual support (English & Hindi) stored securely via TanStack Query and localized profiles.

### 👨‍🎓 Student Portal
- **Secure Onboarding:** Mandatory 30-day password rotation and forced reset on initial login.
- **Academic Performance:** Direct access to recorded marks, historical exams, and calculated percentages.
- **Live Schedules:** Daily class timetables with real-time updates.
- **Notes & Resources:** Dedicated academic tracking per student.

---

## 🏗️ Microservices Architecture

SchoolDesk is built using a highly decoupled, service-oriented architecture ensuring that no single point of failure can bring down the entire school ecosystem. 

```mermaid
graph TD
    Client([Frontend UI - React/Vite]) --> Gateway[API Gateway :9000]
    
    Gateway --> Auth[Auth Service :8000]
    Gateway --> Exam[Exam Service :8001]
    Gateway --> Student[Student Service :8002]
    Gateway --> Time[Timetable Service :8003]
    
    Auth --> DB1[(PostgreSQL DB)]
    Exam --> DB2[(SQLite DB)]
    Student --> DB3[(SQLite DB)]
    Time --> DB4[(SQLite DB)]
```

| Service | Technology | Port | Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Tailwind + Framer | `8080` | Client-facing dynamic application. |
| **API Gateway** | FastAPI + HTTPX | `9000` | Routes traffic, handles CORS, orchestrates microservices. |
| **Auth Service** | FastAPI + Postgres | `8000` | JWT issuance, RBAC, forced password resets, user profile avatars. |
| **Exam Service** | FastAPI + SQLite | `8001` | Manages exams, tracks marks, calculates percentages. |
| **Student Service**| FastAPI + SQLite | `8002` | Roster management and attendance tracking. |
| **Time Service** | FastAPI + SQLite | `8003` | Class scheduling and timetable overlap prevention. |

---

## 🚀 Getting Started

You only need **Docker** and **Docker Compose** installed to run the entire cluster locally. The system is configured to instantly provision a PostgreSQL database alongside the microservices.

### 1. Configure the Environment
Create a `.env` file in the root directory for your database credentials (ensure this is ignored in `.gitignore`):
```env
POSTGRES_USER=schoolums_admin
POSTGRES_PASSWORD=supersecurepassword123
POSTGRES_DB=schoolums_db
DATABASE_URL=postgresql://schoolums_admin:supersecurepassword123@db:5432/schoolums_db
```

### 2. Build and Spin Up the Cluster
Run the following command in the root directory to build the images and start the orchestrated network:
```bash
docker compose up -d --build
```

### 3. Access the Application
- **Frontend App:** [http://localhost:8080](http://localhost:8080)
- **API Gateway Docs:** [http://localhost:9000/docs](http://localhost:9000/docs)

### 4. Exploring the Demo
The application comes with built-in demo credentials for recruiters and visitors to quickly explore the UI.
On the login page at [http://localhost:8080](http://localhost:8080), you will find a **"Demo Access"** section. 
Clicking **Explore as Student** or **Explore as Teacher** will automatically fill the form with the following credentials and sign you in:

| Role | Email | Password |
| :--- | :--- | :--- |
| Teacher | `teacher@demo.com` | `teacher123` |
| Student | `student@demo.com` | `student123` |

*(Note: The demo accounts are seeded automatically if the `ENABLE_DEMO_USERS=true` environment variable is present in the `docker-compose.yml`)*

---

## 🎨 Design & UI Philosophy
Built to feel like a modern SaaS rather than a legacy academic tool. We utilize **Radix UI Primitives** for unstyled accessibility, heavily customized with **Tailwind CSS** to create beautiful glassmorphic cards, smooth **Framer Motion** transitions, and dynamic SVGs from **DiceBear**.

## 🛡️ Security Posture
- **Stateless Authentication:** Fully JWT-based.
- **Role-Based Access Control (RBAC):** Backend dependency injection to isolate endpoints (`Depends(teacher_required)` vs `Depends(student_required)`).
- **Password Policies:** Enforced rotation via `requires_password_change` DB flags and salted bcrypt hashing via Passlib.
- **Secret Management:** Credentials managed securely through `.env` files that remain outside of version control.
