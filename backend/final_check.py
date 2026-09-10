import uuid
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models import User, Worker, Service, Booking, Payment, Review, Complaint

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def run_checks():
    session = SessionLocal()
    print("--- FINAL DATABASE INTEGRITY CHECK ---\n")

    results = []

    def check(name, condition):
        status = "PASS" if condition else "FAIL"
        print(f"[{status}] {name}")
        results.append(status == "PASS")

    try:
        # 1. Required tables exist (Implicitly checked by queries)
        # 2. Exactly six services exist
        services = session.query(Service).all()
        check("Exactly six services exist", len(services) == 6)

        # 3. Service IDs/names are canonical
        canonical_services = {
            "home-cleaning": "Home Cleaning",
            "plumbing": "Plumbing",
            "electrical": "Electrical",
            "painting": "Painting",
            "carpentry": "Carpentry",
            "appliance-repair": "Appliance Repair",
        }
        db_services = {s.id: s.name for s in services}
        check("Service IDs/names are canonical", db_services == canonical_services)

        # 4. Workers exist
        worker_count = session.query(Worker).count()
        check("Workers exist", worker_count > 0)

        # 5. Worker users exist
        total_workers = session.query(Worker).count()
        workers_with_users = session.query(Worker).join(User).count()
        check("Worker users exist", total_workers == workers_with_users)

        # 6. Worker services exist
        workers_with_services = session.query(Worker).join(Service).count()
        check("Worker services exist", total_workers == workers_with_services)

        # 7. No broken worker foreign keys (Handled by join check above)

        # 8. Verified workers exist
        verified_count = session.query(Worker).filter(Worker.is_verified == True).count()
        check("Verified workers exist", verified_count > 0)

        # 9. Available workers exist
        available_count = session.query(Worker).filter(Worker.available == True).count()
        check("Available workers exist", available_count > 0)

        # 10. Delhi + Plumbing + budget <= 1000 returns workers
        # This is the critical test.
        test_workers = session.query(Worker).filter(
            Worker.city == "Delhi",
            Worker.service_id == "plumbing",
            Worker.available == True,
            Worker.hourly_rate <= 1000
        ).count()
        check("Delhi + Plumbing + budget <= 1000 returns workers", test_workers > 0)

        # 11-13. Booking relationships
        bookings = session.query(Booking).all()
        if bookings:
            all_valid = True
            for b in bookings:
                if not (session.query(User).filter(User.id == b.customer_id).first() and
                        session.query(Worker).filter(Worker.id == b.worker_id).first() and
                        session.query(Service).filter(Service.id == b.service_id).first()):
                    all_valid = False
                    break
            check("Every booking has valid relationships", all_valid)
        else:
            check("Every booking has valid relationships", True) # No bookings to fail

        # 14. Payments have valid bookings
        payments = session.query(Payment).all()
        payment_valid = all(session.query(Booking).filter(Booking.id == p.booking_id).first() is not None for p in payments)
        check("Payments have valid bookings", payment_valid)

        # 15. Reviews have valid bookings
        reviews = session.query(Review).all()
        review_valid = all(session.query(Booking).filter(Booking.id == r.booking_id).first() is not None for r in reviews)
        check("Reviews have valid bookings", review_valid)

        # 16. No invalid service IDs exist
        invalid_services = session.query(Worker).filter(~Worker.service_id.in_(list(canonical_services.keys()))).count()
        check("No invalid service IDs in workers", invalid_services == 0)

        # 17. No orphan worker records
        all_user_ids = [u[0] for u in session.query(User.id).all()]
        orphan_workers = session.query(Worker).filter(~Worker.user_id.in_(all_user_ids)).count()
        check("No orphan worker records", orphan_workers == 0)

        print("\n--- FINAL SUMMARY ---")
        if all(results):
            print("RESULT: PASS ✅")
        else:
            print("RESULT: FAIL ❌")

    except Exception as e:
        print(f"Check failed with error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    run_checks()
