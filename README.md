# Kaushal Konnect

Kaushal Konnect is a unified platform that connects cooperative societies of verified skilled workers with customers for domestic and community services, with AI integration for a streamlined process.

## Repository Structure

- `frontend/`: The React/TanStack Start application.
- `backend/`: The Python backend API and services.
- `ml/`: Machine Learning models, notebooks, and research.
- `docs/`: Project documentation, API specs, and architecture.

## Development

### Frontend
Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>/frontend
npm i
npm run dev
```

### Backend
Refer to the `backend/` directory for setup instructions.
Analyze CSV + Design PostgreSQL Schema
Analyze worker_data.csv and bookings.csv; finalize tables, relationships, constraints, UUID strategy, and ML-related fields.
Status: DONE
Set Up PostgreSQL + SQLAlchemy + Alembic
Install/configure PostgreSQL, create kaushal_konnect database, configure SQLAlchemy, Alembic, .env, and verify the DB connection.
Status: DONE
Create DB Models + Migrate CSV Data
Convert the approved schema into SQLAlchemy models, create Alembic migration, and migrate existing CSV data into PostgreSQL.
Status: NEXT
Restructure FastAPI
Organize the backend into production folders such as api/, models/, services/, core/, and db/.
Status: NOT STARTED
Pydantic Schemas + Error Handling
Create request/response schemas and consistent API validation and error handling.
Status: NOT STARTED
Rebuild APIs Using PostgreSQL
Replace CSV-based /workers, /bookings, services, etc. with PostgreSQL-backed APIs.
Status: NOT STARTED
Authentication + Authorization
Add authentication and role-based access for Customer, Worker, Co-op Manager, and Admin.
Status: NOT STARTED
Integrate ML Recommender
Connect the existing recommendation model to real PostgreSQL worker/booking data through a recommendation service.
Status: NOT STARTED
Connect React ↔ FastAPI
Replace frontend mock data with TanStack Query calls to the FastAPI backend.
Status: NOT STARTED
Testing + Security + Deployment
Test the APIs, database, and ML integration; improve security; document the system; and prepare for SIH/production deployment.
Status: NOT STARTED


