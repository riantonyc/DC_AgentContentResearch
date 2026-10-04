import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.models.domain import ContentScript, ActivityLog, UserPersona
from app.agents.script_builder_agent import generate_christian_script

router = APIRouter(prefix="/api/scripts", tags=["scripts"])

class GenerateScriptRequest(BaseModel):
    topic: str
    idea_id: Optional[str] = None
    research_id: Optional[str] = None
    tone: Optional[str] = "Warm & Gentle"
    target_audience: Optional[str] = "Pemuda & Dewasa Muda"
    format: Optional[str] = "Reels / TikTok (<60s)"
    bible_translation: Optional[str] = "TB (Terjemahan Baru)"
    additional_notes: Optional[str] = ""

class SaveScriptRequest(BaseModel):
    title: str
    hook: str
    bible_verse: str
    core_reflection: str
    call_to_action: str
    tone: str
    format: str
    full_script: str
    idea_id: Optional[str] = None
    research_id: Optional[str] = None

@router.post("/generate")
def generate_script_endpoint(req: GenerateScriptRequest, db: Session = Depends(get_db)):
    """
    Generate a tailored Christian Spiritual Script based on topic, tone, and audience.
    """
    # Fetch persona if available
    persona = db.query(UserPersona).first()
    tone = req.tone or (persona.tone if persona else "Warm & Gentle")
    audience = req.target_audience or (persona.target_audience if persona else "Pemuda & Dewasa Muda")
    script_fmt = req.format or (persona.preferred_format if persona else "Reels / TikTok (<60s)")
    translation = req.bible_translation or (persona.bible_translation if persona else "TB (Terjemahan Baru)")

    script_data = generate_christian_script(
        topic=req.topic,
        tone=tone,
        target_audience=audience,
        script_format=script_fmt,
        bible_translation=translation,
        additional_notes=req.additional_notes or ""
    )

    script_id = str(uuid.uuid4())
    new_script = ContentScript(
        id=script_id,
        idea_id=req.idea_id,
        research_id=req.research_id,
        title=script_data.get("title", f"Renungan {req.topic}"),
        hook=script_data.get("hook", ""),
        bible_verse=script_data.get("bible_verse", ""),
        core_reflection=script_data.get("core_reflection", ""),
        call_to_action=script_data.get("call_to_action", ""),
        tone=tone,
        format=script_fmt,
        full_script=script_data.get("full_script", ""),
        status="draft"
    )

    db.add(new_script)

    log = ActivityLog(
        id=str(uuid.uuid4()),
        action_type="GENERATE_CHRISTIAN_SCRIPT",
        entity_type="content_script",
        entity_id=script_id,
        details={"topic": req.topic, "tone": tone, "format": script_fmt}
    )
    db.add(log)
    db.commit()
    db.refresh(new_script)

    return {
        "id": new_script.id,
        "title": new_script.title,
        "hook": new_script.hook,
        "bible_verse": new_script.bible_verse,
        "core_reflection": new_script.core_reflection,
        "call_to_action": new_script.call_to_action,
        "tone": new_script.tone,
        "format": new_script.format,
        "full_script": new_script.full_script,
        "status": new_script.status,
        "created_at": new_script.created_at.isoformat() if new_script.created_at else ""
    }

@router.get("/")
def get_scripts(db: Session = Depends(get_db)):
    scripts = db.query(ContentScript).order_by(ContentScript.created_at.desc()).all()
    return [
        {
            "id": s.id,
            "title": s.title,
            "hook": s.hook,
            "bible_verse": s.bible_verse,
            "core_reflection": s.core_reflection,
            "call_to_action": s.call_to_action,
            "tone": s.tone,
            "format": s.format,
            "full_script": s.full_script,
            "status": s.status,
            "created_at": s.created_at.isoformat() if s.created_at else ""
        }
        for s in scripts
    ]

@router.get("/{script_id}")
def get_script_detail(script_id: str, db: Session = Depends(get_db)):
    script = db.query(ContentScript).filter(ContentScript.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    return {
        "id": script.id,
        "title": script.title,
        "hook": script.hook,
        "bible_verse": script.bible_verse,
        "core_reflection": script.core_reflection,
        "call_to_action": script.call_to_action,
        "tone": script.tone,
        "format": script.format,
        "full_script": script.full_script,
        "status": script.status,
        "created_at": script.created_at.isoformat() if script.created_at else ""
    }

@router.delete("/{script_id}")
def delete_script(script_id: str, db: Session = Depends(get_db)):
    script = db.query(ContentScript).filter(ContentScript.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    
    db.delete(script)
    db.commit()
    return {"message": "Script deleted successfully"}

@router.put("/{script_id}")
def update_script(script_id: str, req: SaveScriptRequest, db: Session = Depends(get_db)):
    script = db.query(ContentScript).filter(ContentScript.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    
    script.title = req.title
    script.hook = req.hook
    script.bible_verse = req.bible_verse
    script.core_reflection = req.core_reflection
    script.call_to_action = req.call_to_action
    script.full_script = req.full_script
    
    db.commit()
    db.refresh(script)
    
    return {
        "id": script.id,
        "title": script.title,
        "hook": script.hook,
        "bible_verse": script.bible_verse,
        "core_reflection": script.core_reflection,
        "call_to_action": script.call_to_action,
        "tone": script.tone,
        "format": script.format,
        "full_script": script.full_script,
        "status": script.status,
        "created_at": script.created_at.isoformat() if script.created_at else ""
    }
