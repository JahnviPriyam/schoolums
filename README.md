# 🎓 SchoolDesk MS
**Real-Time Student & Teacher Management Intelligence**

🚀 A premium, production-grade microservices-based management engine that connects administrators, teachers, and students, providing actionable academic insights and automated administrative workflows.

---

## 📋 Table of Contents
- [Project Vision](#project-vision)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Security](#security)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

---

## 👁️ Project Vision
SchoolDesk MS was built to address a critical gap in educational institution management:

*Most schools rely on disjointed, legacy systems where data is siloed and administrative tasks are entirely manual.*

Our vision is to make school administration and academic tracking a continuous, automated, data-driven process — bringing modern SaaS aesthetics and speed to the education sector.

---

## ⚠️ The Problem
Modern educational environments leak time and efficiency silently:
- **Disjointed Systems:** Teachers use separate tools for attendance, grading, and timetabling.
- **Data Silos:** Student performance metrics are delayed until report cards are generated.
- **Manual Overlap:** Timetable scheduling often results in conflicts that require manual resolution.
- **Poor User Experience:** Legacy portals are clunky, non-responsive, and frustrating for users.

**Result:** Thousands of hours of preventable administrative waste per academic year.

---

## 💡 The Solution
SchoolDesk MS is a real-time educational command center that:
- Connects all modules (Auth, Exams, Students, Timetables) into a unified API Gateway.
- Fetches live metrics from student performance and attendance.
- Calculates automated timetables with conflict prevention.
- Detects inefficiencies via an intelligent dashboard and AI Chatbot assistance.
- Enables one-click onboarding and grade upserting.

---

## 🔥 Key Features

### 1. 👩‍🏫 Intelligent Teacher Portal
- **Intelligent Dashboard:** Real-time analytics, active class counts, and quick insights.
- **Roster & Student Management:** One-click student onboarding with auto-generated secure credentials.
- **Grades & Assessment:** Robust marks upserting, grade reports, and native exam tracking.
- **Attendance Ledger:** Comprehensive daily attendance logging with visual charts.
- **Conflict-Free Timetables:** Assign subjects to timeslots with intelligent overlap prevention.
- **AI Chatbot Integration:** Built-in floating AI assistant to help teachers navigate the platform.
- **Global Settings:** Multilingual support stored securely and localized to user profiles.

### 2. 👨‍🎓 Interactive Student Portal
- **Secure Onboarding:** Mandatory 30-day password rotation and forced reset on initial login.
- **Academic Performance:** Direct access to recorded marks, historical exams, and calculated percentages.
- **Live Schedules:** Daily class timetables with real-time updates.
- **Notes & Resources:** Dedicated academic tracking per student.

### 3. 🎯 Automated Validation & Detection
Automatically identifies:
- Overlapping teacher schedules in the Timetable engine.
- Missing grades for enrolled students.
- Inactive users requiring password resets.

### 4. 📊 Premium Dashboard UI
- **Glassmorphism UI** with pastel gradients.
- **Real-time metric cards** for attendance, grades, and schedules.
- **Interactive charts** for student performance trends.
- **Mobile-responsive design** utilizing modern unstyled components.

---

## 🧠 Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    SchoolDesk MS Ecosystem                  │
│  ┌───────────┬───────────┬─────────┬────────┬──────────┐    │
│  │ Dashboard │ Students  │ Exams   │ Roster │ Schedule │    │
│  │ Analytics │ Profiles  │ Grades  │ Admin  │ Classes  │    │
│  └────────┬──┴────────┬──┴────┬────┴───┬────┴──────┬───┘    │
└───────────┼───────────┼───────┼────────┼──────────┼─────────┘
            │           │       │        │          │
            └─ HTTPX ─── Internal API Routing ──────┘
                        │
            ┌───────────▼───────────┐
            │  API Gateway (FastAPI)│
            │  (Port 9000)          │
            │                       │
            │  • Auth Routing       │
            │  • Student Routing    │
            │  • Exam Routing       │
            │  • Timetable Routing  │
            └────────┬──────────────┘
                     │
            ┌────────▼───────────┬──────────────┬──────────────┐
            │ Auth Service       │ Exam Service │ Time Service │
            │ (Port 8000)        │ (Port 8001)  │ (Port 8003)  │
            │ PostgreSQL         │ SQLite       │ SQLite       │
            └────────┬───────────┴──────────────┴──────────────┘
                     │
     ┌───────────────┼──────────────────────────────┐
     │               │                              │
┌────▼──────┐  ┌─────▼──────┐                 ┌─────▼───────┐
│ Frontend  │  │ PostgreSQL │                 │ Student Svc │
│ Dashboard │  │ Database   │                 │ (Port 8002) │
│(Port 8080)│  │ (Port 5432)│                 │ SQLite      │
└───────────┘  └────────────┘                 └─────────────┘
```

---

## 🛠️ Tech Stack

**Backend**
- **Framework:** FastAPI
- **Architecture:** Microservices
- **Databases:** PostgreSQL (Auth), SQLite (Microservices)
- **ORM:** SQLModel / SQLAlchemy
- **Auth:** JWT tokens + Passlib (bcrypt)
- **Gateway:** HTTPX for internal routing

**Frontend**
- **Framework:** React + Vite (JavaScript)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI Primitives, Framer Motion
- **Avatars:** DiceBear API
- **HTTP Client:** Fetch API / Axios

**DevOps**
- **Containerization:** Docker
- **Orchestration:** Docker Compose

---

## 🔒 Security

### Credential Management
✅ **Best Practices Implemented:**
- **Never hardcode credentials:** Database credentials stored in `.env` (local).
- **Environment variables:** Injected at runtime.
- **.env excluded:** Removed from version control via `.gitignore`.

### JWT Authentication
- Login creates a signed JWT token.
- All API endpoints require a valid token via Bearer Auth.
- Token expiration enforced strictly.

### Password Security
- Passwords hashed with `bcrypt`.
- Never stored in plaintext.
- Enforced password rotation via `requires_password_change` flags.
- Default demo passwords should be changed immediately upon deployment.

### Network Security
- Internal microservices are shielded behind the API Gateway (Port 9000).
- CORS enabled explicitly for the frontend domain.

---

## ⚙️ Prerequisites

**System Requirements:**
- Docker 20.10+
- Docker Compose 1.29+
- Git (for cloning)
- 4GB RAM minimum (2GB backend + 1GB PostgreSQL + 1GB overhead)

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/JahnviPriyam/schoolums.git
cd schoolums
```

### 2. Create Environment File
Create a `.env` file in the project root:
```env
# Database
POSTGRES_USER=schoolums_admin
POSTGRES_PASSWORD=supersecurepassword123
POSTGRES_DB=schoolums_db

# Backend DB Connection
DATABASE_URL=postgresql://schoolums_admin:supersecurepassword123@db:5432/schoolums_db
```
⚠️ **Important:** Keep `.env` secure and never commit it to git.

### 3. Build and Start Containers
```bash
docker compose up --build -d
```
Wait 30-60 seconds for containers to initialize and the PostgreSQL database to bootstrap.

### 4. Verify Services Are Running
```bash
docker compose ps
```
Expected output should show `auth-service`, `exam-service`, `student-service`, `timetable-service`, `api-gateway`, `frontend`, and `db` as `Up`.

---

## 🛠️ Configuration

### Demo Accounts Initialization
The system is configured to instantly seed demo accounts if the environment variable is present.
The `docker-compose.yml` automatically injects `ENABLE_DEMO_USERS=true` into the `auth-service`. 

### Initializing Custom Master Teacher
If you prefer to start fresh without demo users, run this via terminal:
```bash
curl -X 'POST' \
  'http://localhost:9000/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "teacher@school.com",
  "password": "password123",
  "role": "teacher"
}'
```

---

## 💻 Usage

### Dashboard Workflow
1. Navigate to: `http://localhost:8080`
2. **Demo Access:** Use the quick "Demo Access" buttons to automatically log in.
3. **Manual Login:**
   - **Teacher:** `teacher@demo.com` / `teacher123`
   - **Student:** `student@demo.com` / `student123`
4. Verify the dashboard statistics (total students, classes, attendance trends).
5. Interact with the **AI Assistant** in the bottom corner.

### Command-Line Usage

**View Backend Logs:**
```bash
docker compose logs -f auth-service
```

**Stop Services:**
```bash
docker compose down
```

**Stop and Remove Data (Reset Database):**
```bash
docker compose down -v
```

---

## 🔌 API Reference

### Authentication
**Login (POST)**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "teacher@demo.com",
  "password": "teacher123"
}
```
*Response:*
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "role": "teacher"
}
```

*For full API documentation, visit the Swagger Docs at [http://localhost:9000/docs](http://localhost:9000/docs) when the cluster is running.*

---

## 🚨 Troubleshooting

**Issue:** "Database connection refused"
**Cause:** PostgreSQL container takes longer to start than the FastAPI service.
**Solution:**
Docker Compose will automatically restart the failing containers, but you can force it manually:
```bash
docker compose restart auth-service
```

**Issue:** "Login returns 401 Unauthorized"
**Cause:** Demo users failed to seed or database was wiped.
**Solution:**
Ensure `ENABLE_DEMO_USERS=true` is in your `docker-compose.yml` under `auth-service`, and restart the containers.

**Issue:** "Port already in use"
**Cause:** Another service is running on 8080 or 9000.
**Solution:**
Identify the process or change the exposed ports in `docker-compose.yml`.

---

## 👨‍💻 Development

### File Structure
```text
schoolums/
├── backend/
│   ├── api-gateway/            # Central router
│   ├── auth-service/           # JWT & Postgres Users
│   ├── exam-service/           # SQLite grading system
│   ├── student-service/        # SQLite student roster
│   └── timetable-service/      # SQLite schedule engine
├── frontend/
│   ├── src/
│   │   ├── components/         # React unstyled components
│   │   ├── pages/              # Route pages (Login, Dashboard)
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml          # Container orchestration
├── .env                        # Configuration (not in git)
└── README.md
```

---

## 📊 Dashboard & Services

| Service | URL | Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Dashboard** | `http://localhost:8080` | `8080` | Main FinOps UI |
| **API Gateway** | `http://localhost:9000` | `9000` | Central routing |
| **Swagger Docs** | `http://localhost:9000/docs` | `9000` | Interactive API docs |
| **Auth Service** | Internal | `8000` | JWT Auth Engine |
| **PostgreSQL DB** | `localhost:5432` | `5432` | Data persistence |

---

## 🚀 Next Steps
- [x] Set up `.env` with Database credentials
- [x] Run `docker compose up --build -d`
- [x] Log in to dashboard via Demo Access
- [x] Verify routing and AI chatbot
- [x] Analyze automated scheduling engine
