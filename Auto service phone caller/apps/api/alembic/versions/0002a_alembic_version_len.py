"""
Expand alembic_version.version_num length to 128

Revision ID: 0002a_alembic_version_len
Revises: 0001_initial
Create Date: 2025-09-22 12:47:00.000000
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002a_alembic_version_len'
down_revision = '0002_plans_appt'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Ensure alembic_version can store long IDs if needed
    try:
        op.alter_column('alembic_version', 'version_num', type_=sa.String(length=128))
    except Exception:
        # Best-effort; may already be adequate
        pass


def downgrade() -> None:
    try:
        op.alter_column('alembic_version', 'version_num', type_=sa.String(length=32))
    except Exception:
        pass
