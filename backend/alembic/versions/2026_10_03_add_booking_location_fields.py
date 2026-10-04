

"""Add customer locations and booking service location fields.

Revision ID: b81c2e4a6d90
Revises: ef18290d2953
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b81c2e4a6d90"
down_revision: Union[str, None] = "ef18290d2953"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create saved customer locations first.
    op.create_table(
        "customer_locations",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("address", sa.String(), nullable=True),
        sa.Column("latitude", sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column("longitude", sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # Add the selected service location to each booking.
    op.add_column(
        "bookings",
        sa.Column("customer_location_id", sa.UUID(), nullable=True),
    )
    op.add_column(
        "bookings",
        sa.Column("service_address", sa.String(), nullable=True),
    )
    op.add_column(
        "bookings",
        sa.Column("service_latitude", sa.Numeric(precision=9, scale=6), nullable=True),
    )
    op.add_column(
        "bookings",
        sa.Column("service_longitude", sa.Numeric(precision=9, scale=6), nullable=True),
    )

    op.create_foreign_key(
        "fk_bookings_customer_location_id",
        "bookings",
        "customer_locations",
        ["customer_location_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_bookings_customer_location_id",
        "bookings",
        type_="foreignkey",
    )
    op.drop_column("bookings", "service_longitude")
    op.drop_column("bookings", "service_latitude")
    op.drop_column("bookings", "service_address")
    op.drop_column("bookings", "customer_location_id")
    op.drop_table("customer_locations")
