import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.models.domain import UserPersona

router = APIRouter(prefix="/api/persona", tags=["persona"])

class PersonaUpdateRequest(BaseModel):
    creator_name: Optional[str] = "Konten Kreator Rohani"
    niche: Optional[str] = "Renungan & Edukasi Rohani Kristen"
    tone: Optional[str] = "Warm & Gentle"
    target_audience: Optional[str] = "Pemuda & Dewasa Muda"
    preferred_format: Optional[str] = "Reels / TikTok (<60s)"
    bible_translation: Optional[str] = "TB (Terjemahan Baru)"

@router.get("/")
def get_user_persona(db: Session = Depends(get_db)):
    persona = db.query(UserPersona).first()
    if not persona:
        # Create default persona
        persona = UserPersona(
            id=str(uuid.uuid4()),
            creator_name="Kreator Rohani",
            niche="Renungan & Edukasi Rohani Kristen",
            tone="Warm & Gentle",
            target_audience="Pemuda & Dewasa Muda",
            preferred_format="Reels / TikTok (<60s)",
            bible_translation="TB (Terjemahan Baru)"
        )
        db.add(persona)
        db.commit()
        db.refresh(persona)

    return {
        "id": persona.id,
        "creator_name": persona.creator_name,
        "niche": persona.niche,
        "tone": persona.tone,
        "target_audience": persona.target_audience,
        "preferred_format": persona.preferred_format,
        "bible_translation": persona.bible_translation
    }

@router.put("/")
def update_user_persona(req: PersonaUpdateRequest, db: Session = Depends(get_db)):
    persona = db.query(UserPersona).first()
    if not persona:
        persona = UserPersona(id=str(uuid.uuid4()))
        db.add(persona)

    persona.creator_name = req.creator_name or persona.creator_name
    persona.niche = req.niche or persona.niche
    persona.tone = req.tone or persona.tone
    persona.target_audience = req.target_audience or persona.target_audience
    persona.preferred_format = req.preferred_format or persona.preferred_format
    persona.bible_translation = req.bible_translation or persona.bible_translation

    db.commit()
    db.refresh(persona)

    return {
        "message": "Persona updated successfully",
        "persona": {
            "id": persona.id,
            "creator_name": persona.creator_name,
            "niche": persona.niche,
            "tone": persona.tone,
            "target_audience": persona.target_audience,
            "preferred_format": persona.preferred_format,
            "bible_translation": persona.bible_translation
        }
    }
