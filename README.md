# Schoolums - School Management System

Schoolums is a modern, microservice-based school management platform. It features two distinct portals—one for **Teachers** and one for **Students**—to seamlessly handle attendance tracking, exam scoring, and timetable scheduling.

## 🚀 Architecture
This system utilizes a highly scalable, decoupled microservices architecture powered by Docker. 

* **Frontend:** React + Vite + TailwindCSS (Located in `/frontend`)
* **API Gateway:** FastAPI `localhost:9000` (Routes all frontend traffic)
* **Auth Service:** FastAPI `localhost:8000` (Handles authentication, forced password resets, and user roles)
* **Exam Service:** FastAPI `localhost:8001` (Manages exam schedules and student marks)
* **Student Service:** FastAPI `localhost:8002` (Manages student rosters and attendance tracking)
* **Timetable Service:** FastAPI `localhost:8003` (Manages class schedules and prevents overlaps)

---

## 🔐 Key Features

### For Teachers:
- **Dashboard & Analytics:** View active class counts, total students, and quick insights.
- **Roster Management:** Create student accounts. The system will auto-generate temporary credentials for them.
- **Marks & Grading:** Create exams and input/upsert grades for each student natively. View detailed grade reports per student.
- **Attendance Tracking:** Mark comprehensive daily attendance logs.
- **Timetables:** Assign subjects to specific timeslots with built-in conflict prevention.

### For Students:
- **Secure Onboarding:** Students must change their teacher-assigned temporary password upon their first login. Passwords expire every 30 days to enforce rotation security.
- **Performance Access:** Check all recorded exam marks and calculated percentages.
- **Schedules:** View daily class timetables and live attendance numbers.

---

## 🛠️ How to Run Locally

You must have **Docker** and **Docker Compose** installed on your machine.

### 1. Build and Start the Containers
Navigate into the root directory of the project and spin up all microservices and the frontend at once:

```bash
docker compose up --build
```

### 2. Access the Application
Once the containers are successfully running, the services will be available in your browser:

* **Frontend Dashboard:** [http://localhost:8080](http://localhost:8080)
* **API Gateway:** [http://localhost:9000](http://localhost:9000)

### 3. Creating the Initial Teacher
If you are starting with a fresh database, you must manually create your first teacher account before accessing the portal. You can do this by sending a `POST` request to the API Gateway:

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

Log in with `teacher@school.com` and `password123` to begin creating students!

---

## 📁 Tech Stack Overview
- **UI/Visuals:** Framer Motion, Radix UI Primitives, Lucide Icons, Glassmorphism CSS.
- **Frontend Logic:** React Router DOM (v6), React Hook Form, TanStack Query.
- **Backend:** Python + FastAPI apps, SQLModel (SQLAlchemy under the hood).
- **Security:** Standard JWT `Bearer` token implementation, Passlib bcrypt hashing.