"""add user roles for admin access

Revision ID: 7f2c1a9d4e61
Revises: cdc85adcf541
Create Date: 2026-09-07
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7f2c1a9d4e61"
down_revision: Union[str, Sequence[str], None] = "cdc85adcf541"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("users", recreate="always") as batch_op:
        batch_op.add_column(
            sa.Column("role", sa.String(length=20), nullable=False, server_default="user")
        )
        batch_op.create_check_constraint(
            "ck_users_role",
            "role IN ('user', 'admin')",
        )


def downgrade() -> None:
    with op.batch_alter_table("users", recreate="always") as batch_op:
        batch_op.drop_constraint("ck_users_role", type_="check")
        batch_op.drop_column("role")
