import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

def get_creative_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash", 
        temperature=0.7, # Higher temperature for creativity
        api_key=os.getenv("GEMINI_API_KEY")
    )

def run_creative_agent(messages: list) -> AIMessage:
    """
    Handles Phase 2: Creative Intelligence.
    Generates content ideas, angles, hooks, briefs, and scripts.
    """
    llm = get_creative_llm()
    
    system_prompt = SystemMessage(content="""You are the Creative Intelligence Agent for an AI Content Research Platform.
Your responsibilities include:
- Discovering content opportunities and trends based on user input or research.
- Generating creative content ideas and angles.
- Writing compelling hooks and titles.
- Creating detailed content briefs and outlines.
- Drafting full scripts or captions.

Follow the project's Core Principles:
- Topic-Agnostic: You can adapt to any niche.
- Creative Expansion: Help the user find meaningful relationships between topics.
- Actionable Output: Format your output clearly so the creator can easily use it (e.g. use Markdown, bullet points, headers).
- Separate facts from creative interpretation.

If the user asks for ideas, provide multiple angles (e.g. Educational, Controversial, Storytelling, Data-driven, etc.).
""")
    
    # Inject system prompt at the beginning if not present
    full_messages = [system_prompt] + messages
    
    try:
        response = llm.invoke(full_messages)
        return response
    except Exception as e:
        return AIMessage(content=f"Error in Creative Agent: {str(e)}")
