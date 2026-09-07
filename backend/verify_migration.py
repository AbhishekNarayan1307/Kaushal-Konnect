from sqlalchemy import create_engine, text
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
with engine.connect() as conn:
    tables = ['users', 'services', 'cooperatives', 'workers', 'bookings', 'payments', 'reviews', 'complaints']
    for table in tables:
        res = conn.execute(text(f'SELECT count(*) FROM {table}'))
        print(f"{table}: {res.scalar()}")
