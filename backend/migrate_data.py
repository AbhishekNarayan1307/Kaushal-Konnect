import csv
import uuid
from datetime import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.session import Base
from app.models import (
    User,
    Worker,
    Service,
    Cooperative,
    UserRole,
    Booking,
    BookingStatus,
    Review,
    Complaint,
    Payment,
    WorkerSkill,
)
from app.core.config import settings


engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

import os

# Get the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

WORKER_CSV = os.path.join(SCRIPT_DIR, "data", "worker_data_final_india.csv")
BOOKING_CSV = os.path.join(SCRIPT_DIR, "data", "bookings_final_india.csv")


def migrate():
    session = SessionLocal()

    try:
        print("Starting migration...")

        # 0. Clear existing data to avoid duplicates (Dev Mode)
        print("Clearing existing data...")
        session.query(Review).delete()
        session.query(Complaint).delete()
        session.query(Payment).delete()
        session.query(Booking).delete()
        session.query(Worker).delete()
        session.query(WorkerSkill).delete()

        # Only delete users who are workers or customers
        session.query(User).filter(User.role.in_([UserRole.worker, UserRole.customer])).delete()

        session.commit()

        # 1. Migrate Services
        categories = [
            "Electrical",
            "Plumbing",
            "Carpentry",
            "Home Cleaning",
            "Painting",
            "Appliance Repair",
        ]

        for category in categories:
            service = (
                session.query(Service)
                .filter(Service.id == category)
                .first()
            )

            if not service:
                print(f"Creating service: {category}")

                session.add(
                    Service(
                        id=category,
                        name=category,
                        description=f"Professional {category} services",
                        base_price=500.0,
                    )
                )

        session.commit()

        # 2. Create / Get Default Cooperative
        coop = session.query(Cooperative).first()

        if not coop:
            print("Creating default cooperative...")

            coop = Cooperative(
                id=uuid.uuid4(),
                name="Kaushal Main Cooperative",
                location="Delhi NCR",
                contact_email="contact@kaushalkonnect.com",
            )

            session.add(coop)
            session.commit()

        print(f"Using cooperative: {coop.name}")

        # 3. Migrate Workers
        worker_map = {}
        user_map = {}

        worker_count = 0

        with open(
            WORKER_CSV,
            "r",
            encoding="utf-8-sig",
            newline="",
        ) as f:

            reader = csv.DictReader(f)

            for row in reader:
                csv_worker_id = row["worker_id"].strip()

                # Prevent duplicate workers
                if csv_worker_id in worker_map:
                    continue

                category = row["category"].strip()

                # Validate category
                if category not in categories:
                    print(
                        f"Skipping worker {csv_worker_id}: "
                        f"unknown category '{category}'"
                    )
                    continue

                # Create User
                user_id = uuid.uuid4()

                user = User(
                    id=user_id,
                    email=row["email"].strip(),
                    password_hash="hashed_password",
                    full_name=row["full_name"].strip(),
                    phone=str(row["phone"]).strip(),
                    role=UserRole.worker,
                    zone=row["user_zone"].strip(),
                    city=row["city"].strip(),
                    locality=row["locality"].strip(),
                )

                session.add(user)

                user_map[csv_worker_id] = user_id

                # Create Worker
                worker_id = uuid.uuid4()

                worker = Worker(
                    id=worker_id,
                    user_id=user_id,
                    coop_id=coop.id,
                    service_id=category,
                    worker_zone=row["worker_zone"].strip(),
                    city=row["city"].strip(),
                    locality=row["locality"].strip(),
                    available=row["available"].strip() == "1",
                    hourly_rate=float(row["price"]),
                    rating=float(row["rating"]),
                    completed_jobs=int(row["completed_jobs"]),
                    response_minutes=int(row["response_minutes"]),
                    is_verified=True,
                )

                session.add(worker)

                worker_map[csv_worker_id] = worker_id
                worker_count += 1

        session.commit()

        print(f"Migrated {worker_count} workers.")

        # 4. Migrate Bookings
        customer_map = {}
        booking_count = 0

        with open(
            BOOKING_CSV,
            "r",
            encoding="utf-8-sig",
            newline="",
        ) as f:

            reader = csv.DictReader(f)

            for row in reader:
                csv_worker_id = row["worker_id"].strip()
                csv_customer_id = row["customer_id"].strip()

                # Make sure worker exists
                if csv_worker_id not in worker_map:
                    print(
                        f"Skipping booking {row['booking_id']}: "
                        f"worker {csv_worker_id} not found"
                    )
                    continue

                # Create customer only once
                if csv_customer_id in customer_map:
                    customer_id = customer_map[csv_customer_id]

                else:
                    customer_id = uuid.uuid4()

                    customer = User(
                        id=customer_id,
                        email=row["customer_email"].strip(),
                        password_hash="hashed_password",
                        full_name=row["customer_name"].strip(),
                        phone=str(row["customer_phone"]).strip(),
                        role=UserRole.customer,
                        zone=row["user_zone"].strip(),
                    )

                    session.add(customer)

                    customer_map[csv_customer_id] = customer_id

                # Convert CSV status to database status
                csv_status = row["status"].strip().lower()

                status_mapping = {
                    "booked": BookingStatus.ACCEPTED,
                    "completed": BookingStatus.COMPLETED,
                    "cancelled": BookingStatus.CANCELLED,
                    "requested": BookingStatus.REQUESTED,
                    "rejected": BookingStatus.REJECTED,
                }

                booking_status = status_mapping.get(
                    csv_status,
                    BookingStatus.REQUESTED,
                )

                # Parse booking date
                created_at = datetime.fromisoformat(
                    row["created_at"].replace("Z", "+00:00")
                )

                # Create Booking
                booking = Booking(
                    id=uuid.uuid4(),
                    customer_id=customer_id,
                    worker_id=worker_map[csv_worker_id],
                    service_id=row["category"].strip(),
                    status=booking_status,
                    amount=(
                        float(row["budget"])
                        if row["budget"]
                        else 0.0
                    ),
                    booking_date=created_at,
                    slot="Morning",
                )

                session.add(booking)
                booking_count += 1

        session.commit()

        print(f"Migrated {booking_count} bookings.")
        print(f"Migrated {len(customer_map)} unique customers.")
        print("Migration completed successfully.")

    except Exception as e:
        session.rollback()
        print("Migration failed.")
        print(f"Error: {e}")
        raise

    finally:
        session.close()


if __name__ == "__main__":
    migrate()
