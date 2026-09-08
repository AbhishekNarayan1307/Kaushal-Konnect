import sys
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core import security
from app.models import User

def create_user(email, password, full_name, role="customer"):
    db = SessionLocal()
    try:
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"Error: User with email {email} already exists.")
            return

        # Hash the password using the project's security utility
        hashed_password = security.get_password_hash(password)

        # Create new user
        db_user = User(
            email=email,
            password_hash=hashed_password,
            full_name=full_name,
            role=role,
            # Providing defaults for other fields
            phone="0000000000",
            zone="South",
            latitude=0.0,
            longitude=0.0
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        print(f"Successfully created user: {db_user.email} with role {role}")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python create_user.py <email> <password> <full_name> [role]")
        sys.exit(1)

    email_arg = sys.argv[1]
    password_arg = sys.argv[2]
    name_arg = sys.argv[3]
    role_arg = sys.argv[4] if len(sys.argv) > 4 else "customer"

    create_user(email_arg, password_arg, name_arg, role_arg)
