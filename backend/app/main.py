from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.api import chat, research, ideas, social, scripts, persona

# Create DB tables if not existing
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Christian Content Research API",
    description="Backend API for AI-Powered Christian Creator Assistant Platform",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(research.router)
app.include_router(ideas.router)
app.include_router(social.router)
app.include_router(scripts.router)
app.include_router(persona.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Christian Content Creator API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

