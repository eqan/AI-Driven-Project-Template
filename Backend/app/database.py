from contextlib import contextmanager

from model_registry import Base
from config.config import Session, engine

def create_tables():
    Base.metadata.create_all(engine)


@contextmanager
def session_scope():
    session = Session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        Session.remove()
