import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

def perform_google_grounded_research(query: str) -> dict:
    """
    Perform real-time web research grounded in live Google Search results using Gemini API.
    Returns structured result containing formatted content and sources list.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured in .env file.")

    client = genai.Client(api_key=api_key)

    system_instruction = """
Anda adalah Senior Research Agent untuk Content Creator & Strategist.
Tugas Anda adalah melakukan riset mendalam berbasis fakta terkini dari hasil pencarian web.

Sajikan hasil riset dalam format Markdown yang terstruktur dan mudah dibaca:
1. 📌 **Ringkasan Eksekutif & Jawaban Utama**
2. 📊 **Poin Kunci & Temuan Fakta**
3. 💡 **Content Angles & Angles Promosi** (3-4 ide sudut pandang konten unik berdasarkan riset)
4. 🪝 **Hook Konten yang Menarik** (2-3 contoh kalimat hook pembuka konten)
5. 🔗 **Sumber & Sitasi Data** (Sebutkan situs/sumber nyata yang digunakan)

Gunakan bahasa Indonesia yang profesional, ringkas, dan actionable bagi pembuat konten.
"""

    prompt = f"Riset topik berikut secara mendalam menggunakan pencarian web terkini: {query}"

    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3,
                tools=[types.Tool(google_search=types.GoogleSearch())]
            )
        )

        content = response.text or ""
        sources = []

        # Extract grounding metadata sources if available
        if response.candidates and response.candidates[0].grounding_metadata:
            meta = response.candidates[0].grounding_metadata
            if meta.grounding_chunks:
                seen_uris = set()
                for chunk in meta.grounding_chunks:
                    if chunk.web:
                        title = chunk.web.title or "Sumber Web"
                        uri = chunk.web.uri or ""
                        if uri and uri not in seen_uris:
                            seen_uris.add(uri)
                            sources.append({"title": title, "url": uri})

        # Append source links section if candidate sources exist and aren't already formatted
        if sources and "🔗 **Sumber & Sitasi" not in content and "Sumber" not in content:
            content += "\n\n### 🔗 **Sumber Referensi Terkait:**\n"
            for idx, src in enumerate(sources[:5], 1):
                content += f"{idx}. [{src['title']}]({src['url']})\n"

        return {
            "content": content,
            "sources": sources,
            "queries_used": getattr(meta, "web_search_queries", []) if 'meta' in locals() else []
        }

    except Exception as e:
        # Fallback error handling
        return {
            "content": f"⚠️ Terjadi kendala saat melakukan pencarian web: {str(e)}",
            "sources": [],
            "queries_used": []
        }
