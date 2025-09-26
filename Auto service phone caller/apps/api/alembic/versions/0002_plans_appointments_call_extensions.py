"""plans and appointments and call extensions

Revision ID: 0002_plans_appt
Revises: 0001_initial
Create Date: 2025-09-14 09:40:00.000000

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002_plans_appt'
down_revision = '0001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add plan to shops
    with op.batch_alter_table('shops') as batch_op:
        batch_op.add_column(sa.Column('plan', sa.String(length=50), nullable=False, server_default='basic_answer'))

    # Create appointments table
    op.create_table(
        'appointments',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('shop_id', sa.Integer(), sa.ForeignKey('shops.id'), nullable=False),
        sa.Column('customer_id', sa.Integer(), sa.ForeignKey('customers.id'), nullable=False),
        sa.Column('starts_at', sa.DateTime(), nullable=False),
        sa.Column('ends_at', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(length=32), nullable=False, server_default='scheduled'),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('calendar_provider', sa.String(length=32), nullable=True),
        sa.Column('calendar_event_id', sa.String(length=128), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )

    # Extend calls table
    with op.batch_alter_table('calls') as batch_op:
        batch_op.add_column(sa.Column('appointment_id', sa.Integer(), sa.ForeignKey('appointments.id'), nullable=True))
        batch_op.add_column(sa.Column('call_type', sa.String(length=32), nullable=False, server_default='job_update'))


def downgrade() -> None:
    with op.batch_alter_table('calls') as batch_op:
        batch_op.drop_column('call_type')
        batch_op.drop_column('appointment_id')

    op.drop_table('appointments')

    with op.batch_alter_table('shops') as batch_op:
        batch_op.drop_column('plan')
