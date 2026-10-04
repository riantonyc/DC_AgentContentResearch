from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.models.domain import Research, ResearchSource
from app.tools.search import perform_google_grounded_research

router = APIRouter(prefix="/api/research", tags=["research"])

# Pydantic Schemas
class SourceSchema(BaseModel):
    title: str
    url: str

class ResearchCreateSchema(BaseModel):
    query: str
    category: Optional[str] = "AI & Tech"

class ResearchResponseSchema(BaseModel):
    id: str
    title: str
    category: str
    date: str
    summary: str
    fullContent: str
    sources: List[SourceSchema]

    class Config:
        from_attributes = True

@router.get("/", response_model=List[ResearchResponseSchema])
def get_all_research(db: Session = Depends(get_db)):
    """Fetch all research reports from SQLite database."""
    items = db.query(Research).order_by(Research.created_at.desc()).all()
    results = []
    for item in items:
        sources_list = [
            SourceSchema(title=s.title, url=s.url)
            for s in item.sources
        ]
        results.append(ResearchResponseSchema(
            id=item.id,
            title=item.title or item.query,
            category=item.category or "AI & Tech",
            date=item.created_at.strftime("%d %b %Y") if item.created_at else "Baru saja",
            summary=item.summary or "",
            fullContent=item.full_content or "",
            sources=sources_list
        ))
    return results

@router.post("/", response_model=ResearchResponseSchema)
def create_research(payload: ResearchCreateSchema, db: Session = Depends(get_db)):
    """Perform live web search research and persist the result into the database."""
    query = payload.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    research_res = perform_google_grounded_research(query)
    full_content = research_res.get("content", "")
    sources_data = research_res.get("sources", [])

    # Extract clean summary
    summary_text = full_content[:200].replace("\n", " ") + "..." if len(full_content) > 200 else full_content

    new_research = Research(
        id=str(uuid.uuid4()),
        query=query,
        title=query,
        category=payload.category or "AI & Tech",
        summary=summary_text,
        full_content=full_content
    )
    db.add(new_research)
    db.flush()

    db_sources = []
    for s in sources_data:
        src_obj = ResearchSource(
            id=str(uuid.uuid4()),
            research_id=new_research.id,
            title=s.get("title", "Sumber Web"),
            url=s.get("url", "#")
        )
        db_sources.append(src_obj)

    if db_sources:
        db.add_all(db_sources)

    db.commit()
    db.refresh(new_research)

    sources_list = [SourceSchema(title=s.title, url=s.url) for s in new_research.sources]
    return ResearchResponseSchema(
        id=new_research.id,
        title=new_research.title or query,
        category=new_research.category,
        date="Baru saja",
        summary=new_research.summary or "",
        fullContent=new_research.full_content or "",
        sources=sources_list
    )

@router.delete("/{research_id}")
def delete_research(research_id: str, db: Session = Depends(get_db)):
    """Delete a research item from database."""
    item = db.query(Research).filter(Research.id == research_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Research not found")
    db.delete(item)
    db.commit()
    return {"status": "success", "message": "Research deleted"}
