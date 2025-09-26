"""initial schema

Revision ID: 0001_initial
Revises: 
Create Date: 2025-09-14 08:48:00.000000

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'shops',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )

    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('shop_id', sa.Integer(), sa.ForeignKey('shops.id'), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False, server_default='tech'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.UniqueConstraint('email', name='uq_users_email')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=False)

    op.create_table(
        'customers',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('shop_id', sa.Integer(), sa.ForeignKey('shops.id'), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('phone', sa.String(length=32), nullable=False),
        sa.Column('preferred_language', sa.String(length=8), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_customers_phone', 'customers', ['phone'], unique=False)

    op.create_table(
        'vehicles',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('customer_id', sa.Integer(), sa.ForeignKey('customers.id'), nullable=False),
        sa.Column('year', sa.Integer(), nullable=True),
        sa.Column('make', sa.String(length=50), nullable=True),
        sa.Column('model', sa.String(length=50), nullable=True),
        sa.Column('vin', sa.String(length=64), nullable=True),
    )
    op.create_index('ix_vehicles_vin', 'vehicles', ['vin'], unique=False)

    op.create_table(
        'jobs',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('shop_id', sa.Integer(), sa.ForeignKey('shops.id'), nullable=False),
        sa.Column('customer_id', sa.Integer(), sa.ForeignKey('customers.id'), nullable=False),
        sa.Column('vehicle_id', sa.Integer(), sa.ForeignKey('vehicles.id'), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='open'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )

    op.create_table(
        'job_updates',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('job_id', sa.Integer(), sa.ForeignKey('jobs.id'), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('cost', sa.Numeric(10, 2), nullable=True),
        sa.Column('needs_approval', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('approved', sa.Boolean(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )

    op.create_table(
        'calls',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('shop_id', sa.Integer(), sa.ForeignKey('shops.id'), nullable=False),
        sa.Column('job_id', sa.Integer(), sa.ForeignKey('jobs.id'), nullable=False),
        sa.Column('job_update_id', sa.Integer(), sa.ForeignKey('job_updates.id'), nullable=False),
        sa.Column('customer_id', sa.Integer(), sa.ForeignKey('customers.id'), nullable=False),
        sa.Column('to_number', sa.String(length=32), nullable=False),
        sa.Column('from_number', sa.String(length=32), nullable=False),
        sa.Column('twilio_sid', sa.String(length=64), nullable=True),
        sa.Column('status', sa.String(length=32), nullable=False, server_default='queued'),
        sa.Column('outcome', sa.String(length=64), nullable=True),
        sa.Column('approval_result', sa.String(length=16), nullable=True),
        sa.Column('recording_url', sa.Text(), nullable=True),
        sa.Column('tts_path', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('ended_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_calls_twilio_sid', 'calls', ['twilio_sid'], unique=False)

    op.create_table(
        'call_transcripts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('call_id', sa.Integer(), sa.ForeignKey('calls.id'), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('call_transcripts')
    op.drop_index('ix_calls_twilio_sid', table_name='calls')
    op.drop_table('calls')
    op.drop_table('job_updates')
    op.drop_table('jobs')
    op.drop_index('ix_vehicles_vin', table_name='vehicles')
    op.drop_table('vehicles')
    op.drop_index('ix_customers_phone', table_name='customers')
    op.drop_table('customers')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')
    op.drop_table('shops')
