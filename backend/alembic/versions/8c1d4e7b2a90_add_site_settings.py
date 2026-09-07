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
    op.drop_index("ix_site_settings_id", table_name="site_settings")
    op.drop_table("site_settings")
