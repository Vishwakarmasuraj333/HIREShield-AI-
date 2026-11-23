import os
import sys
import pytest

# Ensure backend root is always on sys.path
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from app.models.database import Base, engine

@pytest.fixture(autouse=True, scope="session")
def init_test_database():
    Base.metadata.create_all(bind=engine)
    yield
