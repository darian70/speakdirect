"""compliance fields and integration credentials

Revision ID: 0004_compliance_integrations
Revises: 0003_calls_job_nullable
Create Date: 2025-09-14 10:25:00.000000

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0004_compliance_integrations'
down_revision = '0003_calls_job_nullable'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table('shops') as batch_op:
        batch_op.add_column(sa.Column('record_calls', sa.Boolean(), nullable=False, server_default=sa.text('true')))
        batch_op.add_column(sa.Column('default_timezone', sa.String(length=64), nullable=True))

    with op.batch_alter_table('customers') as batch_op:
        batch_op.add_column(sa.Column('timezone', sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column('call_window_start', sa.String(length=5), nullable=True))
        batch_op.add_column(sa.Column('call_window_end', sa.String(length=5), nullable=True))
        batch_op.add_column(sa.Column('recording_consent', sa.Boolean(), nullable=False, server_default=sa.text('true')))

    op.create_table(
        'integration_credentials',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('shop_id', sa.Integer(), sa.ForeignKey('shops.id'), nullable=False),
        sa.Column('provider', sa.String(length=32), nullable=False),
        sa.Column('token_json', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('integration_credentials')
    with op.batch_alter_table('customers') as batch_op:
        batch_op.drop_column('recording_consent')
        batch_op.drop_column('call_window_end')
        batch_op.drop_column('call_window_start')
        batch_op.drop_column('timezone')
    with op.batch_alter_table('shops') as batch_op:
        batch_op.drop_column('default_timezone')
        batch_op.drop_column('record_calls')
