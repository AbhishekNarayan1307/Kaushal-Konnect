# Kaushal Konnect - Comprehensive Implementation Guide

Kaushal Konnect is a unified platform connecting cooperative societies of verified skilled workers with customers for domestic and community services, integrated with an AI-powered recommendation system.

## 🏗️ System Architecture

The application follows a modern decoupled architecture:

- **Frontend**: React + TanStack Start (Vite)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (Relational)
- **ML Layer**: Scikit-learn based Recommender Model
- **DevOps**: Docker + Nginx

### Data Flow
`User Interface` $\rightarrow$ `FastAPI (Auth Middleware)` $\rightarrow$ `SQLAlchemy ORM` $\rightarrow$ `PostgreSQL`
`User Search` $\rightarrow$ `ML Recommender Service` $\rightarrow$ `DB Worker Data` $\rightarrow$ `Ranked Results`

---

## 🚀 Quick Start: The "One-Command" Launch (Docker)

The easiest way to run the entire project is using Docker Compose. This sets up the database, backend, and frontend automatically.

### 1. Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Setup Environment
```bash
# Navigate to root directory
cd Kaushal-Konnect

# Create environment file
cp .env.example .env
```
*Edit `.env` to set your desired database password and secret key.*

### 3. Launch
```bash
docker-compose up --build -d
```

### 4. Access the App
- **Frontend**: [http://localhost](http://localhost)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠️ Manual Implementation (Developer Mode)

If you prefer to run the components separately for development, follow these steps:

### 🐍 Backend Setup
1. **Database**: Ensure PostgreSQL is installed and running. Create a database named `kaushal_konnect`.
2. **Environment**:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate # Windows: .venv\\Scripts\\activate
   pip install -r requirements.txt
   ```
3. **Configuration**: Create a `.env` file in the `backend/` folder:
   ```env
   DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/kaushal_konnect
   SECRET_KEY=your_secure_key
   ```
4. **Run**:
   ```bash
   uvicorn main:app --reload
   ```

### ⚛️ Frontend Setup
1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install # or bun install
   ```
2. **Configuration**: Create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
3. **Run**:
   ```bash
   npm run dev
   ```

---

## 🗄️ Database & Migration Guide

### Schema Management
The project uses **SQLAlchemy** for models and **Alembic** for migrations.
- **Models**: Defined in `backend/app/models.py`.
- **Migrations**: Located in `backend/alembic/versions/`.

### Seeding Data
To migrate data from the provided CSV files to the database:
```bash
cd backend
python migrate_data.py
python verify_migration.py
```

---

## 🔑 Authentication & Security

### Access Control
The app uses **JWT (JSON Web Tokens)**. Every protected request must include:
`Authorization: Bearer <your_token>`

### User Roles
The system implements Role-Based Access Control (RBAC):
- **Customer**: Can browse workers and create bookings.
- **Worker**: Can manage their profile and view bookings.
- **Co-op Manager**: Can verify workers and manage the cooperative.
- **Admin**: Full system access, including user and system management.

### Auth Flow
`Signup` $\rightarrow$ `Login` $\rightarrow$ `Receive JWT` $\rightarrow$ `Store in LocalStorage` $\rightarrow$ `Attach to API Requests`

---

## 📊 API Reference
The backend is self-documenting. Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs` (Interactive testing)
- **ReDoc**: `http://localhost:8000/redoc` (Clean documentation)

### Key Endpoints
- `POST /auth/signup`: Create new user
- `POST /auth/login`: Get access token
- `GET /recommendations`: Get AI-ranked workers
- `POST /bookings`: Create a new service booking
- `PATCH /workers/{id}/verify`: (Admin only) Verify a worker
