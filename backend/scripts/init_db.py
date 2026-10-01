import os
import sys

# Ensure the app module is found
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import engine, Base
from app.models.domain import User, Profile, Workspace, Project, Conversation, Message, Memory, Research, ResearchSource, ActivityLog

def init_db():
    print("Membuat struktur database awal (SQLite)...")
    Base.metadata.create_all(bind=engine)
    print("Database dan tabel berhasil dibuat!")

if __name__ == "__main__":
    init_db()
