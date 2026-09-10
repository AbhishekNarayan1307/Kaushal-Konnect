from app.db.session import engine
from app.models import Base

def setup():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Database schema updated successfully.")

if __name__ == "__main__":
    setup()
