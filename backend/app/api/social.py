import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.models.domain import SocialAccountStats, ActivityLog
from app.services.social_scraper import scrape_instagram_stats, scrape_tiktok_stats

router = APIRouter(prefix="/api/social", tags=["social"])

class ScrapeRequest(BaseModel):
    platform: str # 'instagram', 'tiktok'
    username: str

class ManualStatsRequest(BaseModel):
    platform: str # 'instagram', 'tiktok'
    username: str
    followers_count: int
    total_likes: int
    total_posts: int
    engagement_rate: Optional[float] = 0.0

@router.post("/scrape")
def scrape_account_stats(req: ScrapeRequest, db: Session = Depends(get_db)):
    """
    Scrape public statistics for an Instagram or TikTok username.
    """
    platform = req.platform.lower().strip()
    username = req.username.strip()

    if platform == "instagram":
        data = scrape_instagram_stats(username)
    elif platform == "tiktok":
        data = scrape_tiktok_stats(username)
    else:
        raise HTTPException(status_code=400, detail="Platform must be 'instagram' or 'tiktok'")

    stat_id = str(uuid.uuid4())
    new_stat = SocialAccountStats(
        id=stat_id,
        platform=data["platform"],
        username=data["username"],
        followers_count=data["followers_count"],
        total_likes=data["total_likes"],
        total_posts=data["total_posts"],
        engagement_rate=data["engagement_rate"],
        is_manual=False,
        raw_metrics=data["raw_metrics"]
    )

    db.add(new_stat)
    
    log = ActivityLog(
        id=str(uuid.uuid4()),
        action_type="SCRAPE_SOCIAL_STATS",
        entity_type="social_account_stats",
        entity_id=stat_id,
        details={"platform": platform, "username": username, "followers": data["followers_count"]}
    )
    db.add(log)
    db.commit()
    db.refresh(new_stat)

    return {
        "id": new_stat.id,
        "platform": new_stat.platform,
        "username": new_stat.username,
        "followers_count": new_stat.followers_count,
        "total_likes": new_stat.total_likes,
        "total_posts": new_stat.total_posts,
        "engagement_rate": new_stat.engagement_rate,
        "is_manual": new_stat.is_manual,
        "status": data["raw_metrics"].get("status", "success"),
        "created_at": new_stat.created_at.isoformat() if new_stat.created_at else ""
    }

@router.post("/manual")
def add_manual_stats(req: ManualStatsRequest, db: Session = Depends(get_db)):
    """
    Manually insert or update platform statistics.
    """
    stat_id = str(uuid.uuid4())
    er = req.engagement_rate
    if er == 0.0 and req.followers_count > 0:
        avg_likes = req.total_likes / max(req.total_posts, 1)
        er = round((avg_likes / req.followers_count) * 100, 2)

    new_stat = SocialAccountStats(
        id=stat_id,
        platform=req.platform.lower(),
        username=f"@{req.username.strip().replace('@', '')}",
        followers_count=req.followers_count,
        total_likes=req.total_likes,
        total_posts=req.total_posts,
        engagement_rate=er,
        is_manual=True,
        raw_metrics={"status": "manual_entry"}
    )
    db.add(new_stat)

    log = ActivityLog(
        id=str(uuid.uuid4()),
        action_type="MANUAL_SOCIAL_STATS",
        entity_type="social_account_stats",
        entity_id=stat_id,
        details={"platform": req.platform, "username": req.username}
    )
    db.add(log)
    db.commit()
    db.refresh(new_stat)

    return {
        "message": "Manual stats saved",
        "data": {
            "id": new_stat.id,
            "platform": new_stat.platform,
            "username": new_stat.username,
            "followers_count": new_stat.followers_count,
            "total_likes": new_stat.total_likes,
            "total_posts": new_stat.total_posts,
            "engagement_rate": new_stat.engagement_rate,
            "created_at": new_stat.created_at.isoformat() if new_stat.created_at else ""
        }
    }

@router.get("/latest")
def get_latest_stats(db: Session = Depends(get_db)):
    """
    Get the latest stats recorded for Instagram and TikTok.
    """
    ig_latest = db.query(SocialAccountStats).filter(SocialAccountStats.platform == "instagram").order_by(SocialAccountStats.created_at.desc()).first()
    tt_latest = db.query(SocialAccountStats).filter(SocialAccountStats.platform == "tiktok").order_by(SocialAccountStats.created_at.desc()).first()

    return {
        "instagram": {
            "id": ig_latest.id,
            "username": ig_latest.username,
            "followers_count": ig_latest.followers_count,
            "total_likes": ig_latest.total_likes,
            "total_posts": ig_latest.total_posts,
            "engagement_rate": ig_latest.engagement_rate,
            "created_at": ig_latest.created_at.isoformat()
        } if ig_latest else None,
        "tiktok": {
            "id": tt_latest.id,
            "username": tt_latest.username,
            "followers_count": tt_latest.followers_count,
            "total_likes": tt_latest.total_likes,
            "total_posts": tt_latest.total_posts,
            "engagement_rate": tt_latest.engagement_rate,
            "created_at": tt_latest.created_at.isoformat()
        } if tt_latest else None
    }

@router.get("/history")
def get_stats_history(platform: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(SocialAccountStats)
    if platform:
        query = query.filter(SocialAccountStats.platform == platform.lower())
    
    stats = query.order_by(SocialAccountStats.created_at.desc()).limit(20).all()
    return [
        {
            "id": s.id,
            "platform": s.platform,
            "username": s.username,
            "followers_count": s.followers_count,
            "total_likes": s.total_likes,
            "total_posts": s.total_posts,
            "engagement_rate": s.engagement_rate,
            "is_manual": s.is_manual,
            "created_at": s.created_at.isoformat() if s.created_at else ""
        }
        for s in stats
    ]
