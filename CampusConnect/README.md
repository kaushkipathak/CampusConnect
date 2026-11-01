# CampusConnect
> **Tagline:** Discover. Participate. Connect.

CampusConnect is a full-stack, enterprise-grade college event discovery and registration platform built with a Java Spring Boot backend, MySQL database, and modern React.js frontend.

It centralizes scattered campus event announcements (WhatsApp groups, notice boards, social media) into a unified, authenticated, role-governed digital ecosystem featuring an **Interest-Based Weighted Recommendation Engine** and a gamified **Campus Passport** with verified participation rewards.

---

## 🎨 Visual Identity & Theme: Lavender & Coral

CampusConnect incorporates an editorial-style interface with warm off-white backgrounds, rounded cards, subtle drop shadows, and high-contrast typography:

- **Royal Violet:** `#7352A3` (Primary buttons, key actions, brand marks)
- **Lavender:** `#B9A1D8` (Borders, subtle chips, secondary highlights)
- **Coral:** `#FF897C` (Callouts, highlights, badges, active accents)
- **Warm White:** `#F8F4F1` (Backgrounds, editorial canvas)
- **Charcoal:** `#30303C` (High-contrast typography and cards)

---

## 🏛️ Architecture & Stakeholder Permissions

The platform strictly enforces role-based access control across **three stakeholders**:

| Stakeholder | Key Permissions & Capabilities |
| :--- | :--- |
| **🎓 Student** | • Register with Registration No., Department, Year, and Areas of Interest<br>• Discover approved events via interest-based recommendation score rankings<br>• Search and filter by category, date, and keyword<br>• View event details with live capacity status & register with duplicate prevention<br>• View & cancel registrations under *My Registrations*<br>• Track verified attendance, level progress, and badges on their *Campus Passport* |
| **🚀 Event Organizer** | • Personalized dashboard with registration analytics (Recharts)<br>• Propose events with posters, categories, venue, capacity, deadlines, and tags<br>• Edit & resubmit pending or rejected events<br>• View administrative rejection feedback reasons<br>• **Strict Ownership Restriction:** Access attendees *only* for events created by their account<br>• Mark student attendance for completed events |
| **🏛️ College Administration** | • Platform-wide governance dashboard with real-time statistics<br>• Event Approval Queue: Approve or Reject proposals with mandatory justification<br>• Attendance Verification Queue: Verify organizer-submitted attendance to award **+50 XP**<br>• Master event directory and club organizer registry |

---

## ⚙️ Technology Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS (Custom Lavender & Coral palette)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios (JWT Interceptor & Session Expiry Handling)
- **Charts:** Recharts (Analytics and registration distribution)

### Backend
- **Language:** Java 21
- **Framework:** Spring Boot 3.2.4
- **Security:** Spring Security 6 with BCrypt password hashing & JJWT
- **Persistence:** Spring Data JPA / Hibernate
- **Build Tool:** Maven (Wrapper included: `./mvnw`)

### Database
- **Primary:** MySQL 8.0+
- **Dev/Test Fallback:** H2 in-memory MySQL emulation mode

---

## 🚀 Getting Started Locally

### Prerequisites
- **JDK 17 or 21** installed (`java -version`)
- **Node.js 18+** and npm (`node -v`)
- **MySQL Server 8.0+** (or use the built-in dev profile)

---

### 1. Database Setup (MySQL)

Create the database and run the schema and sample data scripts:

```bash
# Log in to MySQL
mysql -u root -p

# Execute schema & sample seed data:
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample-data.sql
```

The schema defines all 13 normalized tables:
`users`, `student_profiles`, `interests`, `student_interests`, `event_categories`, `events`, `registrations`, `event_approvals`, `notifications`, `attendance`, `passport_points`, `badges`, and `student_badges`.

---

### 2. Backend Configuration & Execution

You can configure database credentials and the JWT secret either in `backend/src/main/resources/application.properties` or via environment variables:

```bash
# Optional Environment Variables (defaults provided in application.properties)
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/campusconnect?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="your_password"
export JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
```

#### Run the Spring Boot Server:

```bash
cd backend

# On Windows:
.\mvnw.cmd spring-boot:run

# On Linux / macOS:
./mvnw spring-boot:run
```

> **Instant Zero-Config Mode:** If your local MySQL service is offline, you can run the backend immediately using the embedded dev profile:
> ```bash
> .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
> ```
> The application will automatically seed initial data on first boot.

The backend API will start at: `http://localhost:8080`

---

### 3. Frontend Setup & Execution

Open a separate terminal window:

```bash
cd frontend

# Install dependencies:
npm install

# Start Vite dev server:
npm run dev
```

The frontend client will start at: `http://localhost:5173`

---

## 🔑 Pre-Configured Demo Accounts

For faculty presentation and evaluation, use the pre-configured accounts (or click any of the **1-Click Evaluation Accounts** on the login page):

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `amit.student@campusconnect.edu` | `password123` | Amit Kumar (3rd Year CSE, AI/Coding interests, 150 XP, Explorer level) |
| **Student** | `priya.student@campusconnect.edu` | `password123` | Priya Sharma (2nd Year ECE, Arts/Design interests) |
| **Organizer** | `robotics@campusconnect.edu` | `password123` | Robotics & AI Club (CampusHack, Vision Masterclass) |
| **Organizer** | `cultural@campusconnect.edu` | `password123` | Cultural Affairs Council (Aura Musical Night, Futsal, Tree Plantation) |
| **Organizer** | `ecell@campusconnect.edu` | `password123` | E-Cell Entrepreneurship Club (Venture Pitch, UI/UX Designathon) |
| **Admin** | `admin@campusconnect.edu` | `password123` | Dean of Student Affairs (Full governance rights) |

---

## 📅 Pre-Seeded Sample Events in Database

The platform includes 12 diverse sample events across all categories, demonstrating the full lifecycle from administrative review to student discovery and registration:

| ID | Event Title | Category | Organizer | Status | Capacity | Highlights / Matching Tags |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **1** | CampusHack 2026: GenAI & Web3 Sprint | Technical & Coding | Robotics & AI Club | `APPROVED` | 150 | AI, Coding, Technology, Innovation *(Registered by Amit)* |
| **2** | Hands-on Deep Learning & Vision Masterclass | Workshops & Seminars | Robotics & AI Club | `APPROVED` | 60 | AI, Machine Learning, Technology, PyTorch |
| **3** | Aura 2026: Annual Inter-College Musical Night | Cultural & Arts | Cultural Affairs Council | `APPROVED` | 500 | Cultural Activities, Design, Music *(Registered by Priya)* |
| **4** | Venture Pitch 2026: Student Startup Showcase | Entrepreneurship & Business | E-Cell Club | `APPROVED` | 80 | Entrepreneurship, Business, Management, Innovation |
| **5** | Inter-Department Futsal Championship | Sports & Fitness | Cultural Affairs Council | `APPROVED` | 32 | Sports, Fitness, Teamwork |
| **6** | Green Campus: Tree Plantation & Solar Drive | Social & Volunteering | Cultural Affairs Council | `APPROVED` | 120 | Social Impact, Innovation, Community Service |
| **7** | UI/UX Designathon: Campus Mobility | Workshops & Seminars | E-Cell Club | `APPROVED` | 50 | Design, Technology, Innovation, Figma |
| **8** | CodeQuest: Algorithmic Battle | Technical & Coding | Robotics & AI Club | `APPROVED` | 100 | Coding, Technology, Artificial Intelligence |
| **9** | RoboWars & Autonomous Drone Arena | Technical & Coding | Robotics & AI Club | `PENDING` | 200 | Awaiting Admin Approval in Governance Console |
| **10** | E-Summit 2026: Angel Investors Bootcamp | Entrepreneurship & Business | E-Cell Club | `PENDING` | 300 | Awaiting Admin Review in Syndicate Queue |
| **11** | Late Night DJ Bash & Fireworks | Cultural & Arts | Cultural Affairs Council | `REJECTED` | 300 | Rejected: Past curfew hours without syndicate clearance |
| **12** | Off-Campus Extreme Motor Rally | Sports & Fitness | Robotics & AI Club | `REJECTED` | 40 | Rejected: Safety & off-campus liability hazard |

---

## 🌟 Special Differentiating Features

### 1. Interest-Based Recommendation Engine
Located in `com.campusconnect.service.RecommendationService`:
- Compares student's selected interests with event tags, categories, titles, and descriptions.
- **Weighted Scoring Algorithm:**
  - Exact tag match: **+3.0**
  - Category match: **+2.0**
  - Text keyword match: **+1.0**
- Produces transparent explainability chips on event cards (e.g., *"Recommended because you are interested in Artificial Intelligence & Coding"*).
- Updates dynamically whenever a student tunes their interests.

### 2. Campus Passport & Gamification
Located in `com.campusconnect.service.PassportService`:
- **Verified Participation:** Points are **not** awarded on registration; the organizer marks attendance and college administration verifies it.
- **Milestone Badges:** Automatically unlocked upon verification:
  - `First Step` (1 event)
  - `Explorer` (3 events)
  - `Campus Enthusiast` (5 events)
  - `Active Participant` (10 events)
  - `Tech Innovator` (Hackathons)
  - `Cultural Icon` (Arts & concerts)
- **Progression Levels:** Novice (0-99 XP) ➔ Explorer (100-249 XP) ➔ Achiever (250-499 XP) ➔ Master (500-999 XP) ➔ Campus Legend (1000+ XP).
- **Audit Ledger:** Every point transaction is permanently logged in the database to prevent duplicate rewards.

### 3. Strict Backend Ownership Enforcement
In `com.campusconnect.service.RegistrationService`:
```java
if (!event.getOrganizer().getId().equals(organizer.getId())) {
    throw new UnauthorizedException("Security Violation: You are not authorized to view or manage registrations for events created by another organizer.");
}
```
Organizer A can never view or modify registrations for Organizer B's events, even by manipulating URLs or API parameters.

---

## 📡 REST API Summary

### Authentication
- `POST /api/auth/login` – Login & receive JWT
- `POST /api/auth/register` – Register student with academic info & interests
- `GET /api/auth/me` – Current authenticated user details

### Events (Public / Student)
- `GET /api/events` – Filter approved events (category, date range, search)
- `GET /api/events/{id}` – Event details, remaining seats, registration status
- `GET /api/events/categories` – List all event categories

### Student
- `GET /api/student/profile` – Profile with academic info & selected interests
- `PUT /api/student/profile` – Update bio, department, and interests
- `GET /api/student/recommendations` – Recommended events sorted by match score
- `GET /api/student/registrations` – Student's registration list
- `POST /api/events/{id}/register` – Register for an approved event
- `DELETE /api/registrations/{id}` – Cancel RSVP

### Campus Passport
- `GET /api/student/passport` – XP, level, progress %, earned badges, points ledger

### Event Organizer
- `GET /api/organizer/dashboard` – Organizer statistics & registration chart data
- `GET /api/organizer/events` – Events created by current organizer
- `POST /api/organizer/events` – Submit new event proposal (sets status `PENDING`)
- `PUT /api/organizer/events/{id}` – Edit pending/rejected event
- `GET /api/organizer/events/{id}/registrations` – View attendee list (ownership restricted)
- `POST /api/organizer/events/{id}/attendance` – Mark attendee present

### College Administration
- `GET /api/admin/dashboard` – Platform-wide analytics
- `GET /api/admin/events/pending` – Pending approval requests
- `PUT /api/admin/events/{id}/approve` – Approve proposal (makes visible to students)
- `PUT /api/admin/events/{id}/reject` – Reject proposal with mandatory feedback
- `GET /api/admin/attendance/pending` – Organizers' marked attendance list
- `PUT /api/admin/attendance/{id}/verify` – Verify attendance & award XP points
- `GET /api/admin/organizers` – Directory of verified club organizers

### Notifications
- `GET /api/notifications` – In-app notifications with unread count
- `PUT /api/notifications/{id}/read` – Mark notification as read
- `PUT /api/notifications/read-all` – Mark all as read

---

## 🧪 Demonstration Workflow Checklist

1. **Organizer Submission:** Log in as `robotics@campusconnect.edu`. Click **Create New Event**, fill out proposal, submit. Status appears as `PENDING REVIEW`.
2. **Admin Review:** Log in as `admin@campusconnect.edu`. Open **Approval Queue**, review details, click **Approve & Publish**.
3. **Student Discovery:** Log in as `amit.student@campusconnect.edu`. View the approved event prioritized under **Curated Recommendations For You** with explanation reason.
4. **Registration:** Open event details, click **Register Now**. Seat capacity decrements in real time.
5. **Organizer Verification:** Organizer logs in, navigates to event **Participants**, marks Amit present.
6. **Campus Passport Award:** Admin logs in, opens **Passport Verification**, clicks **Verify & Award +50 XP**.
7. **Badge & Level Up:** Student logs in, checks **Campus Passport**: XP points are added and new badges are unlocked!

---

## 🌐 Production Deployment Guide

### Option 1: One-Command Docker Compose (Recommended for Self-Hosting)
The project includes production-ready Dockerfiles and `docker-compose.yml`:
```bash
# Build and spin up MySQL, Spring Boot, and Nginx React containers:
docker compose up -d --build

# Check status:
docker compose ps
```
- Frontend will be accessible at: `http://your-server-ip:80`
- API calls to `/api/*` are reverse-proxied automatically to the Spring Boot container on port 8080.
- MySQL database data is stored in the persistent Docker volume `mysql_data`.

### Option 2: Split Cloud Deployment
1. **Database:** Deploy a managed MySQL instance (AWS RDS, DigitalOcean, PlanetScale, or Railway MySQL).
2. **Backend:** Deploy `backend` to a Java container host (AWS Elastic Beanstalk, Render, Railway, or VPS):
   - Set environment variables: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`.
3. **Frontend:** Build and deploy static assets (`frontend/dist`) to Vercel, Netlify, or Cloudflare Pages with API proxy/redirect rules.
