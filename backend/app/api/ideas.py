from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid
import re

from app.core.database import get_db
from app.models.domain import ContentIdea
from app.agents.creative_agent import run_creative_agent
from langchain_core.messages import HumanMessage

router = APIRouter(prefix="/api/ideas", tags=["ideas"])

# Pydantic Schemas
class IdeaGenerateSchema(BaseModel):
    topic: str
    format: Optional[str] = "Short Video"

class IdeaResponseSchema(BaseModel):
    id: str
    topic: str
    format: str
    angle: str
    hook: str
    outline: List[str]
    isSaved: bool

    class Config:
        from_attributes = True

class VariantRequestSchema(BaseModel):
    topic: str
    current_hook: Optional[str] = None

@router.get("/", response_model=List[IdeaResponseSchema])
def get_all_ideas(db: Session = Depends(get_db)):
    """Fetch all content ideas from database."""
    items = db.query(ContentIdea).order_by(ContentIdea.created_at.desc()).all()
    results = []
    for item in items:
        results.append(IdeaResponseSchema(
            id=item.id,
            topic=item.topic,
            format=item.format or "Short Video",
            angle=item.angle or "Creative Angle",
            hook=item.hook or "",
            outline=item.outline or [],
            isSaved=item.is_saved or False
        ))
    return results

@router.post("/generate", response_model=IdeaResponseSchema)
def generate_and_save_idea(payload: IdeaGenerateSchema, db: Session = Depends(get_db)):
    """Generate a creative content idea & hook using AI and persist to database."""
    topic = payload.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic cannot be empty")

    prompt = f"Buatkan 1 kartu ide konten kreatif terbaik untuk topik '{topic}' dengan format {payload.format}. Tentukan Angle yang menarik, Hook pembuka tajam, dan 3 poin outline."
    ai_response = run_creative_agent([HumanMessage(content=prompt)])
    content_text = ai_response.content if hasattr(ai_response, "content") else str(ai_response)

    # Simple parsing logic for hook and outline
    lines = [line.strip() for line in content_text.split("\n") if line.strip()]
    hook_text = f"Hook: '{topic} - Fakta baru yang wajib kamu tahu di 2026!'"
    outline_points = []

    for l in lines:
        if "hook" in l.lower() or "kalimat pembuka" in l.lower():
            hook_text = l
        elif l.startswith("-") or l.startswith("•") or l.startswith("1.") or l.startswith("2.") or l.startswith("3."):
            outline_points.append(l.lstrip("-•123456789. "))

    if not outline_points:
        outline_points = [content_text[:120] + "..."]

    new_idea = ContentIdea(
        id=str(uuid.uuid4()),
        topic=topic,
        format=payload.format or "Short Video",
        angle="AI Fresh Angle",
        hook=hook_text,
        outline=outline_points[:4],
        is_saved=False
    )

    db.add(new_idea)
    db.commit()
    db.refresh(new_idea)

    return IdeaResponseSchema(
        id=new_idea.id,
        topic=new_idea.topic,
        format=new_idea.format,
        angle=new_idea.angle,
        hook=new_idea.hook,
        outline=new_idea.outline,
        isSaved=new_idea.is_saved
    )

@router.patch("/{idea_id}/toggle-save", response_model=IdeaResponseSchema)
def toggle_save_idea(idea_id: str, db: Session = Depends(get_db)):
    """Bookmark / save or unsave a content idea."""
    item = db.query(ContentIdea).filter(ContentIdea.id == idea_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Idea not found")

    item.is_saved = not item.is_saved
    db.commit()
    db.refresh(item)

    return IdeaResponseSchema(
        id=item.id,
        topic=item.topic,
        format=item.format,
        angle=item.angle,
        hook=item.hook,
        outline=item.outline,
        isSaved=item.is_saved
    )

@router.post("/variants")
def generate_hook_variants(payload: VariantRequestSchema):
    """Generate 4 alternative AI hooks for a topic."""
    prompt = f"Buatkan 4 variasi Hook kalimat pembuka alternatif yang sangat menarik untuk topik '{payload.topic}'. Format setiap hook HANYA 1 baris per hook TANPA kata pengantar, TANPA nomor urut, dan TANPA judul."
    ai_response = run_creative_agent([HumanMessage(content=prompt)])
    content_text = ai_response.content if hasattr(ai_response, "content") else str(ai_response)
    
    raw_lines = [l.strip() for l in content_text.split("\n") if l.strip()]
    cleaned_variants = []

    for line in raw_lines:
        # Ignore intro sentences like "Berikut adalah..." or "Here are..."
        if any(line.lower().startswith(prefix) for prefix in ["berikut", "here are", "ini 4", "variasi hook"]):
            continue
        # Strip leading numbers, bullets, quotes
        cleaned = re.sub(r'^[0-9\.\-\•\*\s"]+', '', line).rstrip('"').strip()
        if len(cleaned) > 10:
            cleaned_variants.append(cleaned)

    if not cleaned_variants:
        cleaned_variants = [f"Banyak yang tidak tahu rahasia tentang {payload.topic} ini!"]

    return {"variants": cleaned_variants[:4]}

