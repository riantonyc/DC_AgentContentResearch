import os
import json
import logging
from typing import Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

logger = logging.getLogger(__name__)

def get_script_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash", 
        temperature=0.7,
        api_key=os.getenv("GEMINI_API_KEY")
    )

def generate_christian_script(
    topic: str,
    tone: str = "Warm & Gentle",
    target_audience: str = "Pemuda & Dewasa Muda",
    script_format: str = "Reels / TikTok (<60s)",
    bible_translation: str = "TB (Terjemahan Baru)",
    additional_notes: str = ""
) -> Dict[str, Any]:
    """
    Generates a personalized Christian Spiritual Script with structured components:
    - Hook
    - Bible Verse
    - Core Reflection
    - Call to Action / Prayer
    - Full Production Script
    """
    llm = get_script_llm()
    
    system_prompt = f"""You are an elite Christian Spiritual Content Creator & Theological Scriptwriter.
Your mission is to write inspiring, authentic, and emotionally resonant scripts for Christian creators.

CRITICAL INSTRUCTION:
Return ONLY valid JSON (no markdown triple backticks around the json, just raw JSON text) with the following structure:
{{
  "title": "Judul Skrip Konten",
  "hook": "Kalimat pembuka (0-3 detik) yang sangat menggugah atau relatable",
  "bible_verse": "Kutipan Ayat Alkitab lengkap beserta Referensi Kitab, Pasal, dan Ayat (Versi {bible_translation})",
  "core_reflection": "Pesan renungan mendalam dan aplikasi praktis kehidupan harian",
  "call_to_action": "Doa singkat / ajakan refleksi di kolom komentar",
  "full_script": "Teks skrip lengkap siap dibaca/direkam, lengkap dengan petunjuk visual (Visual Cue) dan emosi bicaranya"
}}

PERSONA & STYLES:
- Tone Suara: {tone}
- Target Audiens: {target_audience}
- Format Konten: {script_format}
- Terjemahan Alkitab: {bible_translation}
"""

    user_prompt = f"Buatkan skrip rohani Kristen berkualitas tinggi tentang topik berikut: '{topic}'.\nCatatan Tambahan: {additional_notes}"

    try:
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ])
        
        content = response.content.strip()
        # Clean up code fences if present
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        data = json.loads(content)
        return data
    except Exception as e:
        logger.error(f"Error generating Christian script: {str(e)}")
        # Fallback structured script
        return {
            "title": f"Renungan: {topic}",
            "hook": f"Pernahkah kamu merasa lelah dan bingung tentang {topic} dalam hidupmu?",
            "bible_verse": "Filipi 4:6-7 - 'Janganlah hendaknya kamu kuatir tentang apapun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur.'",
            "core_reflection": f"Saat memperjuangkan {topic}, Tuhan mengingatkan kita bahwa kedamaian sejati datang dari rasa percaya kepada-Nya. Serahkan segala kekhawatiranmu hari ini.",
            "call_to_action": "Mari berdoa: Tuhan, berikanlah kami kekuatan dan ketenangan hari ini. Amin. Tulis 'Amin' di kolom komentar jika pesan ini memberkatinmu!",
            "full_script": f"[VISUAL: Wajah tersenyum ramah, latar tempat tenang]\nHOOK: Pernahkah kamu merasa lelah tentang {topic}?\n\n[VISUAL: Teks ayat muncul di layar]\nAYAT: Filipi 4:6-7 - Janganlah hendaknya kamu kuatir...\n\n[VISUAL: Berbicara langsung ke kamera dengan kehangatan]\nRENUNGAN: Tuhan tahu pergumulanmu. Serahkan segala bebanmu kepada-Nya.\n\n[VISUAL: Doa singkat penutup]\nCTA: Tulis Amin jika pesan ini memberkatimu!"
        }
