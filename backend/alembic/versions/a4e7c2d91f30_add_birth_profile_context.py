"""add shared birth context to user profiles

Revision ID: a4e7c2d91f30
Revises: 9d2e6f8a1b30
Create Date: 2026-09-11

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a4e7c2d91f30"
down_revision: Union[str, Sequence[str], None] = "9d2e6f8a1b30"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("profiles", recreate="always") as batch_op:
        batch_op.add_column(sa.Column("birth_date", sa.Date(), nullable=True))
        batch_op.add_column(sa.Column("birth_time", sa.Time(), nullable=True))
        batch_op.add_column(sa.Column("birth_time_unknown", sa.Boolean(), nullable=False, server_default=sa.false()))
        batch_op.add_column(sa.Column("birth_location_id", sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column("birth_timezone", sa.String(length=64), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("profiles", recreate="always") as batch_op:
        batch_op.drop_column("birth_timezone")
        batch_op.drop_column("birth_location_id")
        batch_op.drop_column("birth_time_unknown")
        batch_op.drop_column("birth_time")
        batch_op.drop_column("birth_date")
