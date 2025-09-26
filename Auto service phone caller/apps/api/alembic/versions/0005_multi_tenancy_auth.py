"""multi-tenancy: memberships, phone numbers, agents, user.password_hash

Revision ID: 0005_multi_tenancy_auth
Revises: 0004_compliance_integrations
Create Date: 2025-09-14 11:05:00.000000

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0005_multi_tenancy_auth'
down_revision = '0004_compliance_integrations'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # users: add password_hash
    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('password_hash', sa.String(length=255), nullable=True))

    # memberships table
    op.create_table(
        'memberships',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('shop_id', sa.Integer(), sa.ForeignKey('shops.id'), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False, server_default='viewer'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_memberships_user_shop', 'memberships', ['user_id', 'shop_id'], unique=True)

    # phone_numbers table
    op.create_table(
        'phone_numbers',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('shop_id', sa.Integer(), sa.ForeignKey('shops.id'), nullable=False),
        sa.Column('provider', sa.String(length=32), nullable=False, server_default='twilio'),
        sa.Column('number', sa.String(length=32), nullable=False),
        sa.Column('friendly_name', sa.String(length=255), nullable=True),
        sa.Column('status', sa.String(length=16), nullable=False, server_default='active'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ux_phone_numbers_number', 'phone_numbers', ['number'], unique=True)

    # agents table
    op.create_table(
        'agents',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('shop_id', sa.Integer(), sa.ForeignKey('shops.id'), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('type', sa.String(length=32), nullable=False, server_default='phone'),
        sa.Column('voice_id', sa.String(length=64), nullable=True),
        sa.Column('prompt', sa.Text(), nullable=True),
        sa.Column('language', sa.String(length=16), nullable=True),
        sa.Column('recording_policy', sa.String(length=16), nullable=True),
        sa.Column('quiet_hours_start', sa.String(length=5), nullable=True),
        sa.Column('quiet_hours_end', sa.String(length=5), nullable=True),
        sa.Column('phone_number_id', sa.Integer(), sa.ForeignKey('phone_numbers.id'), nullable=True),
        sa.Column('status', sa.String(length=16), nullable=False, server_default='active'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('agents')
    op.drop_index('ux_phone_numbers_number', table_name='phone_numbers')
    op.drop_table('phone_numbers')
    op.drop_index('ix_memberships_user_shop', table_name='memberships')
    op.drop_table('memberships')
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('password_hash')
