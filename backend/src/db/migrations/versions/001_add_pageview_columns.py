"""Add url and referrer columns to pageviews table

Revision ID: 001
Revises: 
Create Date: 2024-03-24 13:45:53.822528

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add url and referrer columns if they don't exist
    op.add_column('pageviews', sa.Column('url', sa.String(2048), nullable=True))
    op.add_column('pageviews', sa.Column('referrer', sa.String(2048), nullable=True))

def downgrade():
    # Remove url and referrer columns
    op.drop_column('pageviews', 'url')
    op.drop_column('pageviews', 'referrer') 