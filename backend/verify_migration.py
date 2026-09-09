from sqlalchemy import create_engine, text

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)


def check_table_counts():
    print("Checking database table counts...\n")

    tables = [
        "users",
        "services",
        "cooperatives",
        "workers",
        "bookings",
        "payments",
        "reviews",
        "complaints",
    ]

    try:
        with engine.connect() as conn:

            for table in tables:
                try:
                    result = conn.execute(
                        text(f'SELECT COUNT(*) FROM "{table}"')
                    )

                    count = result.scalar()

                    print(f"{table}: {count}")

                except Exception as e:
                    print(f"{table}: ❌ Error - {e}")

    except Exception as e:
        print(f"❌ Database connection failed: {e}")


if __name__ == "__main__":
    check_table_counts()