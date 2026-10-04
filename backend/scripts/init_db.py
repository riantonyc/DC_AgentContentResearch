import os
import sys
import uuid

# Ensure the app module is found
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import engine, Base, SessionLocal
from app.models.domain import (
    User, Profile, Workspace, Project, Conversation, Message, Memory, 
    Research, ResearchSource, ContentIdea, ContentScript, UserPersona, SocialAccountStats, ActivityLog
)

def init_db():
    print("Membuat struktur database awal (SQLite)...")
    Base.metadata.create_all(bind=engine)
    print("Database dan tabel berhasil dibuat!")

    db = SessionLocal()
    try:
        # Seed Persona
        if db.query(UserPersona).count() == 0:
            print("Seeding default Christian Creator Persona...")
            p = UserPersona(
                id=str(uuid.uuid4()),
                creator_name="Kreator Rohani",
                niche="Renungan & Edukasi Rohani Kristen",
                tone="Warm & Gentle",
                target_audience="Pemuda & Dewasa Muda",
                preferred_format="Reels / TikTok (<60s)",
                bible_translation="TB (Terjemahan Baru)"
            )
            db.add(p)

        # Seed Social Account Stats
        if db.query(SocialAccountStats).count() == 0:
            print("Seeding statistik awal media sosial...")
            s1 = SocialAccountStats(
                id=str(uuid.uuid4()),
                platform="instagram",
                username="@renungan.harian.id",
                followers_count=2450,
                total_likes=38900,
                total_posts=84,
                engagement_rate=5.4,
                is_manual=False,
                raw_metrics={"status": "initial_seed"}
            )
            s2 = SocialAccountStats(
                id=str(uuid.uuid4()),
                platform="tiktok",
                username="@kreator.kristen",
                followers_count=6120,
                total_likes=114000,
                total_posts=112,
                engagement_rate=9.2,
                is_manual=False,
                raw_metrics={"status": "initial_seed"}
            )
            db.add_all([s1, s2])

        # Seed Research
        if db.query(Research).count() == 0:
            print("Seeding data awal untuk Christian Research...")
            r1 = Research(
                id=str(uuid.uuid4()),
                title="Menghadapi Kecemasan & Overthinking menurut Alkitab",
                query="Menghadapi Kecemasan menurut Alkitab Filipi 4",
                category="Renungan & Kehidupan",
                summary="Alkitab memberikan janji kedamaian sejahtera Allah melalui Filipi 4:6-7 dan 1 Petrus 5:7. Mengalihkan kecemasan menjadi doa permohonan dengan ucapan syukur.",
                full_content="""### 📌 Ringkasan Renungan
Kecemasan adalah salah satu pergumulan terbesar pemuda dan dewasa muda saat ini. Alkitab tidak menghakimi rasa cemas, melainkan mengundangnya untuk dibawa ke dalam doa.

### 📖 Ayat Utama & Teologi:
- **Filipi 4:6-7**: 'Janganlah hendaknya kamu kuatir tentang apapun juga...'
- **1 Petrus 5:7**: 'Serahkanlah segala kekhawatiranmu kepada-Nya, sebab Ia yang memelihara kamu.'

### 💡 Content Angles Rekomendasi:
1. *Saat Malam Overthinking: Apa yang Harus Dilakukan Menurut Alkitab?*
2. *Perbedaan Khawatir Biasa vs Mengandalkan Tuhan (Studi Filipi 4).*
3. *Doa Singkat 30 Detik Saat Serangan Cemas Datang.*""",
                key_points=["Kecemasan harus dialihkan menjadi doa", "Damai sejahtera Allah melampaui segala akal", "1 Petrus 5:7 mengingatkan pemeliharaan Tuhan"]
            )
            src1 = ResearchSource(id=str(uuid.uuid4()), research_id=r1.id, title="Alkitab Online (Sabda)", url="https://alkitab.sabda.org")
            db.add_all([r1, src1])

        # Seed Content Ideas & Script
        if db.query(ContentIdea).count() == 0:
            print("Seeding data awal untuk Content Ideas & Scripts...")
            i1 = ContentIdea(
                id=str(uuid.uuid4()),
                topic="Menghadapi Kecemasan & Overthinking",
                format="Short Video",
                angle="Relatable / Storytelling",
                hook="Pernah ga sih pas mau tidur, otak kamu malah jalan terus mikirin masa depan?",
                outline=["Pergumulan overthinking anak muda", "Janji Tuhan di Filipi 4:6-7", "Doa penyesuaian pikiran"],
                is_saved=True
            )
            db.add(i1)

            s1 = ContentScript(
                id=str(uuid.uuid4()),
                idea_id=i1.id,
                title="Skrip: Menghadapi Overthinking",
                hook="Kalau malam ini kamu merasa cemas dan overthinking sama masa depanmu, video ini buat kamu...",
                bible_verse="Filipi 4:6-7 - Janganlah hendaknya kamu kuatir tentang apapun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa.",
                core_reflection="Tuhan tahu betapa beratnya beban yang kamu pikul sendiri. Dia tidak minta kamu menyelesaikan semuanya malam ini, Dia cuma minta kamu percaya dan melepaskan kontrol itu ke tangan-Nya.",
                call_to_action="Tulis 'Amin' di kolom komentar jika kamu memilih untuk menyerahkan kekhawatiranmu malam ini kepada Tuhan. Jangan lupa simpan video ini ya!",
                tone="Warm & Gentle",
                format="Reels / TikTok (<60s)",
                full_script="""[VISUAL: Wajah ramah dengan pencahayaan hangat, latar belakang tenang]
[AUDIO: Musik instrumental piano lembut]

HOOK (0-5s):
'Kalau malam ini kamu merasa cemas dan overthinking sama masa depanmu, tenang dulu... video ini buat kamu.'

AYAT ALKITAB (5-15s):
[VISUAL: Teks ayat Filipi 4:6 muncul di layar]
'Filipi 4:6 mengingatkan kita: Janganlah hendaknya kamu kuatir tentang apapun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa.'

RENUNGAN (15-45s):
'Kadang kita cemas karena kita mencoba jadi Tuhan atas hidup kita sendiri — mencoba mengontrol hal-hal yang di luar kendali kita. Tapi ingat, Tuhan tidak pernah minta kamu menyelesaikan semuanya sendirian malam ini. Dia cuma minta kamu datang, berdoa, dan percaya.'

CTA & DOA (45-60s):
'Mari kita berdoa: Tuhan, aku serahkan seluruh rasa cemasku malam ini ke dalam tangan-Mu. Berikan kami kedamaian-Mu. Amin. Tulis Amin di komentar jika pesan ini menguatkanmu!'""",
                status="draft"
            )
            db.add(s1)

        db.commit()
        print("Data awal Christian Creator berhasil di-seed!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding DB: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()

