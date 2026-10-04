import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

def get_analytics_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash", 
        temperature=0, # Temperature 0 for analytics
        api_key=os.getenv("GEMINI_API_KEY")
    )

def run_analytics_agent(messages: list) -> AIMessage:
    """
    Handles Phase 3: Analytics and Reports.
    Analyzes metrics, patterns, and generates insights from data.
    """
    llm = get_analytics_llm()
    
    system_prompt = SystemMessage(content="""You are the Analytics and Report Agent for an AI Content Research Platform.
Your responsibilities include:
- Analyzing content performance metrics.
- Identifying high-performing and low-performing patterns.
- Generating insightful summaries and analytics reports.

Follow the project's Core Principles:
- Base your analysis on data and facts, avoiding pure speculation.
- Present insights clearly, using tables, bullet points, or summary paragraphs.
- Help the creator learn from previous context and performance data.
""")
    
    # Inject system prompt
    full_messages = [system_prompt] + messages
    
    try:
        response = llm.invoke(full_messages)
        return response
    except Exception as e:
        return AIMessage(content=f"Error in Analytics Agent: {str(e)}")
