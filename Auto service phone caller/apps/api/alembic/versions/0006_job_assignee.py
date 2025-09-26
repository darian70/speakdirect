"""
Add assigned_user_id to jobs

Revision ID: 0006_job_assignee
Revises: 0005_multi_tenancy_auth
Create Date: 2025-09-21 18:52:00.000000
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0006_job_assignee'
down_revision = '0005_multi_tenancy_auth'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('jobs', sa.Column('assigned_user_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_jobs_assigned_user_id_users', 'jobs', 'users', ['assigned_user_id'], ['id'], ondelete=None
    )


def downgrade() -> None:
    op.drop_constraint('fk_jobs_assigned_user_id_users', 'jobs', type_='foreignkey')
    op.drop_column('jobs', 'assigned_user_id')
