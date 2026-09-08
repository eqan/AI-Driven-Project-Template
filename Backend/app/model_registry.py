"""Central import point for SQLAlchemy metadata discovery.

Alembic and bootstrap code can import this module to ensure every table model
is registered on ``Base.metadata`` before schema operations run.
"""

from base import Base

# Import all ORM models so they attach themselves to Base.metadata.
from chatbot.models.chat import Chat  # noqa: F401
from stats.models.stats import ConversationStats  # noqa: F401
from ticket.models.ticket import Ticket  # noqa: F401
from users.models.user import User  # noqa: F401

__all__ = ["Base"]
