from app.db.session import engine
from sqlalchemy import text

def test_connection():
    print("Testing database connection...")
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Connection successful!")
            print(f"Database version: {result.scalar()}")
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_connection()
