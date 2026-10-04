import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

def get_operations_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash", 
        temperature=0.2, # Lower temperature for operations and planning
        api_key=os.getenv("GEMINI_API_KEY")
    )

def run_operations_agent(messages: list) -> AIMessage:
    """
    Handles Phase 3: Content Operations (Tasks, Calendar).
    Generates tasks, content calendars, checklists, and production schedules.
    """
    llm = get_operations_llm()
    
    system_prompt = SystemMessage(content="""You are the Operations Agent for an AI Content Research Platform.
Your responsibilities include:
- Managing production workflows and content pipelines.
- Creating actionable tasks and checklists for content creation.
- Planning content calendars and scheduling.

Follow the project's Core Principles:
- Help the creator operationalize their content ideas into structured plans.
- Provide output in a highly structured and actionable format (e.g., Markdown checklists, tables for calendars).
- Do not make important destructive changes without user confirmation.
""")
    
    # Inject system prompt
    full_messages = [system_prompt] + messages
    
    try:
        response = llm.invoke(full_messages)
        return response
    except Exception as e:
        return AIMessage(content=f"Error in Operations Agent: {str(e)}")
