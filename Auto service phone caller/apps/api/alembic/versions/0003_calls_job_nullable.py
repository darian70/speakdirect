"""calls job columns nullable

Revision ID: 0003_calls_job_nullable
Revises: 0002a_alembic_version_len
Create Date: 2025-09-14 10:09:00.000000

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0003_calls_job_nullable'
down_revision = '0002a_alembic_version_len'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table('calls') as batch_op:
        batch_op.alter_column('job_id', existing_type=sa.Integer(), nullable=True)
        batch_op.alter_column('job_update_id', existing_type=sa.Integer(), nullable=True)


def downgrade() -> None:
    with op.batch_alter_table('calls') as batch_op:
        batch_op.alter_column('job_update_id', existing_type=sa.Integer(), nullable=False)
        batch_op.alter_column('job_id', existing_type=sa.Integer(), nullable=False)
