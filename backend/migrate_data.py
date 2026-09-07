import csv
import uuid
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.db.session import Base
from app.models import User, Worker, Service, Cooperative, UserRole
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

def migrate():
    print("Starting migration...")

    # 1. Migrate Services
    categories = ["Plumber", "Electrician", "Carpenter", "Mechanic"]
    for cat in categories:
        service = session.query(Service).filter(Service.id == cat).first()
        if not service:
            print(f"Creating service: {cat}")
            session.add(Service(id=cat, name=cat, description=f"Professional {cat} services", base_price=500.0))
    session.commit()

    # 2. Create Default Cooperative
    coop = session.query(Cooperative).first()
    if not coop:
        print("Creating default cooperative...")
        coop = Cooperative(
            id=uuid.uuid4(),
            name="Kaushal Main Cooperative",
            location="Central Zone",
            contact_email="contact@kaushalkonnect.com"
        )
        session.add(coop)
        session.commit()
    else:
        coop_id = coop.id

    # 3. Migrate Workers from worker_data.csv
    worker_map = {} # csv_id -> uuid
    user_map = {}   # csv_id -> uuid

    with open("data/worker_data.csv", "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            w_id = row['worker_id']
            if row['category'] == 'string':
                continue
            if w_id not in worker_map:
                # Create User
                u_id = uuid.uuid4()
                user = User(
                    id=u_id,
                    email=f"worker_{w_id}@kaushal.com",
                    password_hash="hashed_password",
                    full_name=f"Worker {w_id}",
                    phone=f"555-{w_id}",
                    role=UserRole.worker,
                    zone=row['user_zone']
                )
                session.add(user)
                user_map[w_id] = u_id

                # Create Worker
                worker_id = uuid.uuid4()
                worker = Worker(
                    id=worker_id,
                    user_id=u_id,
                    coop_id=coop.id if 'coop' in locals() else coop.id, # Fix reference
                    service_id=row['category'],
                    worker_zone=row['worker_zone'],
                    available=row['available'] == '1',
                    hourly_rate=float(row['price']),
                    rating=float(row['rating']),
                    completed_jobs=int(row['completed_jobs']),
                    response_minutes=int(row['response_minutes']),
                    is_verified=True
                )
                session.add(worker)
                worker_map[w_id] = worker_id

    session.commit()
    print(f"Migrated {len(worker_map)} unique workers.")

    # 4. Migrate Bookings from bookings.csv
    with open("data/bookings.csv", "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Map CSV IDs to UUIDs
            w_id_csv = row['worker_id']
            c_id_csv = row['customer_id']

            if w_id_csv in worker_map:
                # Note: we don't have a customer map because users.id is UUID.
                # For simplicity, we create a temporary customer user if not exists.
                # But in a real migration, we'd need a customers.csv.
                # Since we don't have one, we'll create dummy customers for the bookings.

                # This is a simplification to ensure FKs are met.
                cust_id = uuid.uuid4()
                customer = User(
                    id=cust_id,
                    email=f"cust_{c_id_csv}@kaushal.com",
                    password_hash="hashed_password",
                    full_name=f"Customer {c_id_csv}",
                    role=UserRole.customer
                )
                session.add(customer)

                from app.models import Booking, BookingStatus
                booking = Booking(
                    id=uuid.uuid4(),
                    customer_id=cust_id,
                    worker_id=worker_map[w_id_csv],
                    service_id=row['category'],
                    status=BookingStatus.ACCEPTED if row['status'] == 'booked' else BookingStatus.REQUESTED,
                    amount=float(row['budget']) if row['budget'] else 0.0,
                    booking_date=datetime.fromisoformat(row['created_at'].replace('Z', '+00:00')),
                    slot="Morning" # Default slot
                )
                session.add(booking)

    session.commit()
    print("Migrated bookings.")

if __name__ == "__main__":
    migrate()
