# Kaushal-Konnect - Complete Developer Guide

## 1. Project Overview

Kaushal-Konnect is a unified platform connecting cooperative societies of verified skilled workers with customers for domestic and community services, integrated with an AI-powered recommendation system.

The platform professionalizes home services by organizing workers into cooperatives, ensuring fair wages, providing verification, and using Machine Learning (ML) to match customers with the best available professionals based on category, zone, and budget.

### Major Components
- **Frontend**: A modern React-based web application providing dashboards for Customers, Workers, and Cooperative Managers.
- **Backend**: A robust FastAPI server handling business logic, authentication, and data orchestration.
- **Database**: A PostgreSQL database storing user profiles, cooperative details, worker skills, and booking history.
- **ML Recommender**: A Scikit-learn based model that ranks workers based on ratings, distance, and pricing.
- **Docker**: Containerization for consistent deployment across different environments.

### Architecture Diagram

```mermaid
graph TD
    Browser[Web Browser] -->|HTTP/HTTPS| Frontend[Frontend - Port 80]
    Frontend -->|JSON/REST| Backend[FastAPI Backend - Port 8000]
    Backend -->|SQL| DB[PostgreSQL Database - Port 5432]
    Backend -->|Inference| ML[ML Recommender Model]
```

---

## 2. Technology Stack

| Component | Technology | Purpose |
|-----------|-------------|---------|
| Frontend | TanStack Start (React + Nitro) | User interface and routing |
| Backend | FastAPI (Python) | REST API and business logic |
| Database | PostgreSQL 15 | Persistent data storage |
| ORM | SQLAlchemy | Database abstraction and querying |
| Migration | Alembic | Database schema versioning |
| Authentication | JWT (python-jose) + passlib | Secure user auth and password hashing |
| ML/AI | Scikit-learn, Pandas, Joblib | Worker recommendation ranking |
| Containerization | Docker & Docker Compose | Environment isolation and orchestration |
| Package Manager | Bun (Frontend), Pip (Backend) | Dependency management |
| Build System | Vite | Frontend bundling and HMR |

---

## 3. Project Structure

```text
Kaushal-Konnect/
├── backend/                # FastAPI Backend
│   ├── app/                # Application source code
│   │   ├── api/            # API endpoints (v1)
│   │   ├── core/           # Config, security, and constants
│   │   ├── db/             # Session and engine configuration
│   │   ├── models.py       # SQLAlchemy database models
│   │   ├── schemas/        # Pydantic data validation models
│   │   └── services/       # Business logic (e.g., recommendation service)
│   ├── alembic/            # Database migration scripts
│   ├── data/               # CSV files for initial data seeding
│   ├── models/             # Pre-trained ML model (.joblib)
│   ├── alembic.ini         # Alembic configuration
│   ├── create_user.py       # Script to manually create users
│   ├── Dockerfile          # Backend container definition
│   └── main.py             # FastAPI entry point
├── frontend/               # TanStack Start Frontend
│   ├── src/                # Application source
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks (e.g., useAuth)
│   │   ├── lib/            # API utilities and constants
│   │   ├── routes/         # File-system based routing
│   │   └── router.tsx      # Root router configuration
│   ├── Dockerfile          # Frontend container definition
│   └── package.json        # Frontend dependencies and scripts
├── .env                    # Local environment variables (Secret)
├── .env.example            # Template for environment variables
├── docker-compose.yml      # Docker orchestration
└── GUIDE.md                # This developer guide
```

---

## 4. Prerequisites

### Required Software

| Software | Why it's needed | How to verify | Required for Docker? |
|----------|-----------------|---------------|---------------------|
| **Git** | Cloning the repository | `git --version` | Yes |
| **Docker Desktop** | Running the full app stack | `docker --version` | Yes |
| **Docker Compose** | Orchestrating containers | `docker compose version` | Yes |
| **Python 3.11+** | Local backend development | `python --version` | No |
| **Node.js / Bun** | Local frontend development | `node --version` or `bun --version` | No |
| **PostgreSQL** | Local database testing | `psql --version` | No |

---

## 5. Environment Variables

The application uses a `.env` file to manage configuration. Copy `.env.example` to `.env` and modify the values.

### Configuration Table

| Variable | Purpose | Example/Placeholder | Required | Component |
|----------|---------|---------------------|----------|-----------|
| `DB_USER` | PostgreSQL username | `user` | Yes | DB, Backend |
| `DB_PASSWORD` | PostgreSQL password | `password123` | Yes | DB, Backend |
| `DB_NAME` | PostgreSQL database name | `kaushal_konnect` | Yes | DB, Backend |
| `SECRET_KEY` | JWT signing key | `your-long-random-string` | Yes | Backend |
| `ALGORITHM` | JWT hashing algorithm | `HS256` | No | Backend |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT validity duration | `1440` | No | Backend |
| `VITE_API_URL` | Backend API URL for frontend | `http://kaushal-konnect.onrender.com` | Yes | Frontend |

### Important Notes
- **Frontend Variables**: `VITE_API_URL` is used at build-time. If you change this variable, you MUST rebuild the frontend container.
- **Docker Compose**: Changing `.env` variables used by the database (like `DB_PASSWORD`) will NOT update an existing database volume. You must delete the volume (`docker compose down -v`) and restart to apply password changes.

### Restart vs. Rebuild
- `docker compose restart`: Restarts containers. Use this for minor logic changes or if a service crashed.
- `docker compose up -d --build`: Rebuilds images and restarts. Use this after changing `package.json`, `requirements.txt`, `Dockerfile`, or environment variables.

---

## 6. Running the Application with Docker

Follow these steps to get the application running from a fresh clone.

### Step 1 - Clone Repository
```powershell
git clone https://github.com/<your-repo>/kaushal-konnect.git
cd kaushal-konnect
```

### Step 2 - Create Environment File
```powershell
copy .env.example .env
```
*Open `.env` in a text editor and update the `SECRET_KEY` and `DB_PASSWORD`.*

### Step 3 - Build and Start Containers
```powershell
docker compose up -d --build
```

### Step 4 - Verify Containers
```powershell
docker compose ps
```

You should see `kk_frontend`, `kk_backend`, and `kk_db` as `Up` (healthy).

### Step 5 - Initialize Database
The project uses Alembic for migrations. Run the following command to apply the schema to the database:
```powershell
docker exec -it kk_backend alembic upgrade head
docker exec -it kk_backend python migrate_data.py "use this"
```

### Step 6 - Create Initial Admin User
Create an admin user to access the management dashboards:
```powershell
docker exec -it kk_backend python create_user.py admin@example.com admin123 "System Admin" admin
```

### Step 7 - Access the Application
- **Frontend**: [http://localhost](http://localhost)
- **Backend API Docs (Swagger)**: [http://kaushal-konnect.onrender.com/docs](http://kaushal-konnect.onrender.com/docs)
- **Backend API Docs (ReDoc)**: [http://kaushal-konnect.onrender.com/redoc](http://kaushal-konnect.onrender.com/redoc)

### Stopping the Application
- **Stop and remove containers**: `docker compose down`
- **Stop and DELETE ALL DATA (DB volumes)**: `docker compose down -v`
  - ⚠️ **WARNING**: `docker compose down -v` deletes your PostgreSQL data. Use with caution.

---

## 7. Running Without Docker (Local Development)

### Backend Setup
1. **Virtual Environment**:
   ```powershell
   cd backend
   python -m venv .venv
   .\\.venv\\Scripts\\activate
   pip install -r requirements.txt
   ```
2. **Environment**: Create `backend/.env` with:
   ```env
   DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/kaushal_konnect
   SECRET_KEY=your-secret-key
   ```
3. **Database**: Ensure PostgreSQL is running locally and a database named `kaushal_konnect` exists.
4. **Migrations**: `alembic upgrade head`
5. **Start Server**: `uvicorn main:app --reload --port 8000`

### Frontend Setup
1. **Dependencies**:
   ```powershell
   cd frontend
   npm install  # or bun install
   ```
2. **Environment**: Create `frontend/.env` with:
   ```env
   VITE_API_URL=http://kaushal-konnect.onrender.com
   ```
3. **Start Dev Server**: `npm run dev`

---

## 8. Frontend

### Framework & Routing
- **Framework**: React 19 + Vite.
- **Routing**: TanStack Router (File-system based).
- **API Client**: Standard `fetch` calls to the backend.

### Application Routes
| Route | Purpose | Auth Required |
|-------|---------|--------------|
| `/` | Landing Page / Search | No |
| `/login` | User Login | No |
| `/signup` | User Registration | No |
| `/worker` | Worker Dashboard | Yes (Worker/Admin) |
| `/coop` | Cooperative Management | Yes (Coop Manager/Admin) |
| `/dashboard` | Customer Dashboard | Yes (Customer/Admin) |

---

## 9. Backend

### Architecture
- **Entry Point**: `backend/main.py`
- **Framework**: FastAPI
- **Startup Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`
- **URL**: `http://kaushal-konnect.onrender.com`

### Internal Structure
- `app/api/v1/endpoints/`: Contains the route handlers for auth, workers, bookings, and recommendations.
- `app/core/`: Centralized configuration and JWT security logic.
- `app/services/`: Logic for the ML recommendation engine and booking calculations.

---

## 10. API Documentation

The API is self-documenting via FastAPI.

| Method | Endpoint | Purpose | Authentication |
|--------|----------|---------|----------------|
| `POST` | `/auth/signup` | Create a new account | None |
| `POST` | `/auth/login` | Get JWT access token | None |
| `GET` | `/recommendations` | Get AI-ranked workers | JWT Token |
| `GET` | `/workers` | List all workers | JWT Token |
| `POST` | `/bookings` | Request a service | JWT Token |
| `PATCH` | `/workers/{id}/verify` | Verify worker credentials | JWT Token (Admin) |

- **Interactive Docs**: `http://kaushal-konnect.onrender.com/docs`
- **Static Docs**: `http://kaushal-konnect.onrender.com/redoc`

---

## 11. Database

### Configuration
- **Image**: `postgres:15-alpine`
- **Container Name**: `kk_db`
- **Default User**: `user` (from `.env`)
- **Default DB**: `kaushal_konnect` (from `.env`)
- **Internal Host**: `db:5432` (inside Docker network)
- **External Host**: `localhost:5432` (on host machine)

### Database Schema

| Table | Purpose | Primary Key | Key Relationships |
|-------|---------|-------------|-------------------|
| `users` | User profiles and auth | `id` (UUID) | $\rightarrow$ `workers`, `bookings` |
| `cooperatives` | Cooperative society info | `id` (UUID) | $\rightarrow$ `workers` |
| `services` | Available service types | `id` (String) | $\rightarrow$ `workers`, `bookings` |
| `workers` | Worker professional details | `id` (UUID) | `user_id` $\rightarrow$ `users`, `coop_id` $\rightarrow$ `cooperatives` |
| `worker_skills` | Worker skills mapping | `worker_id`, `skill_name` | `worker_id` $\rightarrow$ `workers` |
| `bookings` | Service requests/slots | `id` (UUID) | `customer_id` $\rightarrow$ `users`, `worker_id` $\rightarrow$ `workers` |
| `payments` | Payment records | `id` (UUID) | `booking_id` $\rightarrow$ `bookings` |
| `reviews` | Customer ratings | `id` (UUID) | `booking_id` $\rightarrow$ `bookings` |
| `complaints` | Issue reporting | `id` (UUID) | `booking_id` $\rightarrow$ `bookings` |

---

## 12. Accessing PostgreSQL

### Method 1 - pgAdmin
1. Install pgAdmin 4.
2. Create a new server connection:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Maintenance Database**: `kaushal_konnect`
   - **Username**: `user` (from `.env`)
   - **Password**: `password` (from `.env`)

### Method 2 - psql (via Docker)
Run the PostgreSQL interactive shell directly inside the container:
```powershell
docker exec -it kk_db psql -U user -d kaushal_konnect
```
**Useful psql commands**:
- `\dt` : List all tables
- `\d users` : Describe the users table
- `SELECT * FROM users;` : View all users
- `\q` : Exit psql

---

## 13. Database Migrations

This project uses **Alembic** to manage the database schema.

### Migration Workflow
1. **Modify Model**: Edit `backend/app/models.py` to add/change columns or tables.
2. **Generate Migration**:
   ```powershell
   docker exec -it kk_backend alembic revision --autogenerate -m "description of change"
   ```
3. **Apply Migration**:
   ```powershell
   docker exec -it kk_backend alembic upgrade head
   ```
4. **Verify**: Use pgAdmin or `psql` to ensure the schema is updated.

⚠️ **Warning**: Do NOT manually edit tables via SQL in production. Always use Alembic migrations to ensure consistency across development and production environments.

---

## 14. User Management

### User Model
Users are stored in the `users` table with the following roles:
- `customer`: Standard user who books services.
- `worker`: Verified professional providing services.
- `coop_manager`: Manages a cooperative and verifies workers.
- `admin`: System administrator.

### Creating Users Manually
Use the provided Python script to create test users without using the frontend:
```powershell
# Syntax: python create_user.py <email> <password> <full_name> [role]
docker exec -it kk_backend python create_user.py test@example.com pass123 "Test User" worker
```

### Authentication Flow
1. **Signup**: User provides email/password $\rightarrow$ Password hashed via `passlib` $\rightarrow$ Saved to `users` table.
2. **Login**: User provides credentials $\rightarrow$ Backend verifies hash $\rightarrow$ Backend generates JWT token.
3. **Authenticated Request**: Frontend attaches token to `Authorization: Bearer <token>` header $\rightarrow$ Backend validates token $\rightarrow$ Request granted.

---

## 15. Docker Architecture

| Service | Container | Port (External:Internal) | Purpose |
|---------|-----------|--------------------------|---------|
| `frontend` | `kk_frontend` | `80:3000` | React Web UI |
| `backend` | `kk_backend` | `8000:8000` | FastAPI REST API |
| `db` | `kk_db` | `5432:5432` | PostgreSQL Database |

**Network Flow**:
`Browser` $\rightarrow$ `kk_frontend` $\rightarrow$ `http://kaushal-konnect.onrender.com` (via browser) $\rightarrow$ `kk_backend` $\rightarrow$ `db:5432` (via internal Docker network).

---

## 16. Ports and URLs

| Component | Browser URL | Internal Docker Host | Purpose |
|-----------|-------------|----------------------|---------|
| Frontend | `http://localhost` | `kk_frontend:3000` | Web Application |
| Backend | `http://kaushal-konnect.onrender.com` | `kk_backend:8000` | REST API |
| Swagger | `http://kaushal-konnect.onrender.com/docs` | `kk_backend:8000/docs` | API Testing |
| ReDoc | `http://kaushal-konnect.onrender.com/redoc` | `kk_backend:8000/redoc` | API Documentation |
| PostgreSQL | N/A | `db:5432` | Database Storage |

---

## 17. Development Workflow

### Daily Cycle
1. **Start**: `docker compose up -d`
2. **Verify**: `docker compose ps` and check `http://localhost`
3. **Frontend Changes**: Edit `frontend/src/...` $\rightarrow$ Vite HMR updates browser instantly.
4. **Backend Changes**: Edit `backend/app/...` $\rightarrow$ Uvicorn reloads (if running in dev mode) or `docker compose restart backend`.
5. **DB Changes**: Edit `models.py` $\rightarrow$ `alembic revision --autogenerate` $\rightarrow$ `alembic upgrade head`.
6. **Dependency Changes**: Edit `requirements.txt` or `package.json` $\rightarrow$ `docker compose up -d --build`.
7. **Commit**: `git add .` $\rightarrow$ `git commit -m "feat: ..."` $\rightarrow$ `git push`.

---

## 18. Troubleshooting

### Common Problems

| Problem | Cause | Fix |
|---------|-------|-----|
| `ModuleNotFoundError: jose` / `passlib` | Missing Python dependencies | `docker compose up -d --build` |
| `relation "users" does not exist` | Database not initialized | `docker exec -it kk_backend alembic upgrade head` |
| `password authentication failed` | `.env` password mismatch with DB volume | `docker compose down -v` then `docker compose up -d` |
| `Frontend 404` | Route not defined in TanStack Router | Check `frontend/src/routes/` |
| `Connection Refused` (Backend) | Backend container not running | `docker compose logs backend` to check for crashes |
| `kaushal-konnect.onrender.com` not working | Backend port mapping failed | Check `docker ps` to see if 8000 is mapped |

---

## 19. Logs and Debugging

### Inspecting Container Logs
- **All containers**: `docker compose logs -f`
- **Backend only**: `docker compose logs -f backend`
- **Frontend only**: `docker compose logs -f frontend`
- **Database only**: `docker compose logs -f db`

### Common Log Errors
- **PostgreSQL**: "database system is shut down" $\rightarrow$ Database is still starting up; wait a few seconds.
- **FastAPI**: "Address already in use" $\rightarrow$ Another process is using port 8000. Kill it or change the port.

---

## 20. Testing

**Automated Tests**: Currently, no comprehensive automated test suite (Pytest/Jest) exists in the repository.

**Manual Verification**:
- Use the **Swagger UI** (`/docs`) to test individual API endpoints.
- Run `docker exec -it kk_backend python test_db.py` to verify database connectivity.

---

## 21. Build and Deployment

### Development Build
The `docker-compose.yml` is configured for development with port mapping and volume mounts.

### Production Considerations
Before deploying to production:
1. **Secret Key**: Change `SECRET_KEY` to a cryptographically strong random string.
2. **DB Password**: Use a strong, unique password for the PostgreSQL user.
3. **CORS**: Restrict `allow_origins=["*"]` in `backend/main.py` to your actual domain.
4. **Frontend**: Run `npm run build` to create an optimized production bundle.
5. **Debug Mode**: Ensure FastAPI is NOT running with `--reload` in production.

---

## 22. Security

- **Environment Secrets**: Never commit the `.env` file to Git. It is listed in `.gitignore`.
- **Passwords**: Never store passwords in plain text. The project uses `bcrypt` via `passlib`.
- **JWT Security**: Set a short expiration time for access tokens in `.env`.
- **Database Exposure**: In production, the PostgreSQL port `5432` should NOT be exposed to the public internet; it should only be accessible by the backend container.

---

## 23. Git Workflow

### File Management
- **Commit**: Source code, Dockerfiles, `alembic` versions, `package.json`, `requirements.txt`.
- **Ignore**: `.env`, `node_modules/`, `__pycache__/`, `.venv/`, `.DS_Store`.

### Basic Commands
```powershell
git checkout -b feature/new-feature  # Create new branch
git add .                            # Stage changes
git commit -m "feat: add xyz"        # Commit changes
git push origin feature/new-feature  # Push to remote
```

---

## 24. ML / AI Components

### Overview
The project includes a recommendation system that ranks workers based on a weighted score of ratings, price, and proximity.

- **Model File**: `backend/models/kaushal_konnect_recommendation_model.joblib`
- **Logic**: Implemented in `backend/recommender.py`.
- **API Integration**: Exposed via the `/recommendations` endpoint.
- **Training**: The model is trained using the Jupyter notebook in `ml/Kaushal_Konnect.ipynb`.

---

## 25. Quick Start (First-Time Setup)

If you are a new developer, do this:

1. **Clone**: `git clone <repo_url>` $\rightarrow$ `cd kaushal-konnect`
2. **Env**: `copy .env.example .env` $\rightarrow$ *Update SECRET_KEY*
3. **Start**: `docker compose up -d --build`
4. **DB Init**: `docker exec -it kk_backend alembic upgrade head`
5. **User**: `docker exec -it kk_backend python create_user.py admin@example.com admin123 "Admin" admin`
6. **Verify**: Open `http://localhost` and `http://kaushal-konnect.onrender.com/docs`

---

## 26. Common Command Cheat Sheet

| Task | Command |
|------|---------|
| **Start App** | `docker compose up -d` |
| **Rebuild & Start** | `docker compose up -d --build` |
| **Stop App** | `docker compose down` |
| **Wipe Data & Stop** | `docker compose down -v` |
| **Backend Logs** | `docker compose logs -f backend` |
| **DB Shell** | `docker exec -it kk_db psql -U user -d kaushal_konnect` |
| **Apply Migrations** | `docker exec -it kk_backend alembic upgrade head` |
| **Create User** | `docker exec -it kk_backend python create_user.py <email> <pass> <name> [role]` |
| **Test DB Connection**| `docker exec -it kk_backend python test_db.py` |

---

## 27. Current Project Status

- **Frontend**: ✅ Functional (TanStack Start)
- **Backend**: ✅ Functional (FastAPI)
- **Database**: ✅ Functional (PostgreSQL)
- **Authentication**: ✅ Functional (JWT)
- **Docker**: ✅ Functional (Compose)
- **Migrations**: ✅ Functional (Alembic)
- **ML/AI**: ✅ Functional (Joblib Model)
- **Testing**: ⚠️ No automated test suite (Manual testing only)
- **Known Issues**:
  - Database volume persistence requires `down -v` for password changes.
  - Frontend build-time variables require rebuild on change.
