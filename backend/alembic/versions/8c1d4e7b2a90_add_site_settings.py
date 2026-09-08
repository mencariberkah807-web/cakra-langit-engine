"""add complete site settings CMS schema

Revision ID: 8c1d4e7b2a90
Revises: 7f2c1a9d4e61
Create Date: 2026-09-07

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "8c1d4e7b2a90"
down_revision: Union[str, Sequence[str], None] = "7f2c1a9d4e61"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "site_settings",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("site_name", sa.String(length=120), nullable=False, server_default="Cakra Langit"),
        sa.Column("tagline", sa.String(length=255), nullable=True),
        sa.Column("logo", sa.String(length=500), nullable=True),
        sa.Column("favicon", sa.String(length=500), nullable=True),
        sa.Column("hero_image", sa.String(length=500), nullable=True),
        sa.Column("hero_title", sa.String(length=255), nullable=True),
        sa.Column("hero_description", sa.Text(), nullable=True),
        sa.Column("primary_cta_label", sa.String(length=120), nullable=True),
        sa.Column("secondary_cta_label", sa.String(length=120), nullable=True),
        sa.Column("feature_1_title", sa.String(length=120), nullable=True),
        sa.Column("feature_1_description", sa.String(length=255), nullable=True),
        sa.Column("feature_2_title", sa.String(length=120), nullable=True),
        sa.Column("feature_2_description", sa.String(length=255), nullable=True),
        sa.Column("feature_3_title", sa.String(length=120), nullable=True),
        sa.Column("feature_3_description", sa.String(length=255), nullable=True),
        sa.Column("feature_4_title", sa.String(length=120), nullable=True),
        sa.Column("feature_4_description", sa.String(length=255), nullable=True),
        sa.Column("login_image", sa.String(length=500), nullable=True),
        sa.Column("page_title", sa.String(length=255), nullable=True),
        sa.Column("meta_description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.execute(
        sa.text(
            "INSERT INTO site_settings "
            "(site_name, tagline, hero_title, hero_description, primary_cta_label, secondary_cta_label, "
            "feature_1_title, feature_1_description, feature_2_title, feature_2_description, "
            "feature_3_title, feature_3_description, feature_4_title, feature_4_description) "
            "VALUES (:site_name, :tagline, :hero_title, :hero_description, :primary_cta_label, :secondary_cta_label, "
            ":f1t, :f1d, :f2t, :f2d, :f3t, :f3d, :f4t, :f4d)"
        ).bindparams(
            site_name="Cakra Langit",
            tagline="Personal Almanac",
            hero_title="Harmoni Langit, Panduan Kehidupan",
            hero_description="Cakra Langit membantu Anda memahami waktu, alam, dan diri melalui berbagai sistem kalender tradisional dan astronomi modern.",
            primary_cta_label="Mulai Jelajahi",
            secondary_cta_label="Pelajari Lebih Lanjut",
            f1t="Akurat",
            f1d="dengan data astronomi",
            f2t="Menggabungkan",
            f2d="kearifan tradisional",
            f3t="Mudah digunakan",
            f3d="untuk semua orang",
            f4t="Selalu diperbarui",
            f4d="setiap hari",
        )
    )


def downgrade() -> None:
    op.drop_table("site_settings")
