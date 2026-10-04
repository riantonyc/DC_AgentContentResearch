from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True) # Typically UUID from Supabase Auth
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_active_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False)
    workspaces = relationship("Workspace", back_populates="user")
    memories = relationship("Memory", back_populates="user")
    activities = relationship("ActivityLog", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    display_name = Column(String)
    avatar_url = Column(String, nullable=True)
    
    user = relationship("User", back_populates="profile")

class Workspace(Base):
    __tablename__ = "workspaces"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="workspaces")
    projects = relationship("Project", back_populates="workspace")

class Project(Base):
    __tablename__ = "projects"
    id = Column(String, primary_key=True, index=True)
    workspace_id = Column(String, ForeignKey("workspaces.id"))
    name = Column(String)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    workspace = relationship("Workspace", back_populates="projects")
    conversations = relationship("Conversation", back_populates="project")
    researches = relationship("Research", back_populates="project")

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    title = Column(String)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    project = relationship("Project", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True, index=True)
    conversation_id = Column(String, ForeignKey("conversations.id"))
    role = Column(String) # 'user', 'assistant', 'system', 'tool'
    content = Column(Text)
    tool_calls = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    conversation = relationship("Conversation", back_populates="messages")

class Memory(Base):
    __tablename__ = "memories"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String) # 'profile', 'interest', 'knowledge', 'project_context'
    content = Column(Text)
    meta_data = Column(JSON, nullable=True) # renamed from metadata because metadata is reserved in SQLAlchemy
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="memories")

class Research(Base):
    __tablename__ = "research"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    query = Column(String)
    title = Column(String, nullable=True)
    category = Column(String, default="AI & Tech")
    summary = Column(Text, nullable=True)
    full_content = Column(Text, nullable=True)
    key_points = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    project = relationship("Project", back_populates="researches")
    sources = relationship("ResearchSource", back_populates="research", cascade="all, delete-orphan")

class ResearchSource(Base):
    __tablename__ = "research_sources"
    id = Column(String, primary_key=True, index=True)
    research_id = Column(String, ForeignKey("research.id"))
    title = Column(String)
    url = Column(String)
    extracted_content = Column(Text, nullable=True)
    relevance_score = Column(Float, nullable=True)
    
    research = relationship("Research", back_populates="sources")

class ContentIdea(Base):
    __tablename__ = "content_ideas"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    topic = Column(String)
    format = Column(String, default="Short Video") # 'Short Video', 'LinkedIn', 'Thread', 'Article'
    angle = Column(String)
    hook = Column(Text)
    outline = Column(JSON) # list of points
    is_saved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# --- ACTIVITY TRACKING ---
class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    action_type = Column(String) # e.g. "PERFORM_RESEARCH", "CREATE_IDEA", "UPDATE_MEMORY", "SCRAPE_SOCIAL_STATS"
    entity_type = Column(String, nullable=True) # e.g. "research", "memory", "project", "social_account_stats"
    entity_id = Column(String, nullable=True)
    details = Column(JSON, nullable=True) # payload info
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="activities")

# --- SOCIAL MEDIA ANALYTICS STATS ---
class SocialAccountStats(Base):
    __tablename__ = "social_account_stats"
    id = Column(String, primary_key=True, index=True)
    platform = Column(String) # 'instagram', 'tiktok'
    username = Column(String) # '@kreator_rohani'
    followers_count = Column(Integer, default=0)
    total_likes = Column(Integer, default=0)
    total_posts = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    is_manual = Column(Boolean, default=False)
    raw_metrics = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# --- CHRISTIAN CREATOR PERSONA & CUSTOM SCRIPT ---
class UserPersona(Base):
    __tablename__ = "user_personas"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    creator_name = Column(String, default="Konten Kreator Rohani")
    niche = Column(String, default="Renungan & Edukasi Rohani Kristen")
    tone = Column(String, default="Warm & Gentle") # 'Warm & Gentle', 'Passionate & Bold', 'Youthful & Relatable', 'Deep & Exegetical'
    target_audience = Column(String, default="Pemuda & Dewasa Muda")
    preferred_format = Column(String, default="Reels / TikTok (<60s)")
    bible_translation = Column(String, default="TB (Terjemahan Baru)")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ContentScript(Base):
    __tablename__ = "content_scripts"
    id = Column(String, primary_key=True, index=True)
    research_id = Column(String, ForeignKey("research.id"), nullable=True)
    idea_id = Column(String, ForeignKey("content_ideas.id"), nullable=True)
    title = Column(String)
    hook = Column(Text)
    bible_verse = Column(Text)
    core_reflection = Column(Text)
    call_to_action = Column(Text)
    tone = Column(String)
    format = Column(String) # 'Reels / TikTok', 'Carousel IG', 'Khotbah Pendek'
    full_script = Column(Text)
    status = Column(String, default="draft") # 'draft', 'scheduled', 'published'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

