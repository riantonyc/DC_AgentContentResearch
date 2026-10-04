import os
from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, BaseMessage, AIMessage
from pydantic import BaseModel, Field
import operator
from dotenv import load_dotenv

load_dotenv()

# State schema for the orchestrator agent
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    intent: str
    actions_taken: list[str]

# Schema for Intent classification
class IntentClassification(BaseModel):
    intent: Literal["CHAT", "RESEARCH", "PLAN", "CREATE", "ANALYZE"] = Field(
        description="Classify the user's intent. 'RESEARCH' for gathering information or searching the web. 'PLAN' for operations, creating content outlines, tasks, or schedules. 'CREATE' for generating content ideas, angles, hooks, scripts, or briefs. 'ANALYZE' for analytics, reports, or evaluating content performance. 'CHAT' for general conversation or anything else."
    )

# Shared LLM instance
def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash", 
        temperature=0,
        api_key=os.getenv("GEMINI_API_KEY")
    )

# Nodes
def analyze_intent(state: AgentState):
    """Analyze the user's intent to decide which tools/agents to use."""
    llm = get_llm()
    structured_llm = llm.with_structured_output(IntentClassification)
    
    last_message = state["messages"][-1]
    try:
        result = structured_llm.invoke([
            {"role": "system", "content": "You are the orchestrator of an AI Content Research Platform. Classify the user's intent based on their latest message."},
            last_message
        ])
        intent = result.intent
    except Exception as e:
        intent = "CHAT" # Fallback
        
    return {"intent": intent, "actions_taken": [f"Intent classified as {intent}"]}

def process_chat(state: AgentState):
    """Generate a general chat response."""
    llm = get_llm()
    llm.temperature = 0.7 # More creative for chat
    try:
        response = llm.invoke(state["messages"])
        return {"messages": [response], "actions_taken": ["Processed via Chat Agent"]}
    except Exception as e:
        return {"messages": [AIMessage(content=f"Error in Chat Agent: {str(e)}")], "actions_taken": ["Error handled"]}

def process_research(state: AgentState):
    """Handle research-heavy tasks with real-time Web Search Grounding."""
    from app.tools.search import perform_google_grounded_research
    
    last_user_message = state["messages"][-1]
    query = last_user_message.content if hasattr(last_user_message, "content") else str(last_user_message)
    
    try:
        research_result = perform_google_grounded_research(query)
        response_content = research_result.get("content", "Gagal mendapatkan hasil riset.")
        response = AIMessage(content=response_content)
        return {
            "messages": [response], 
            "actions_taken": [f"Processed via Grounded Research Agent ({len(research_result.get('sources', []))} sources cited)"]
        }
    except Exception as e:
        error_msg = AIMessage(content=f"⚠️ Gagal melakukan riset: {str(e)}")
        return {"messages": [error_msg], "actions_taken": ["Research Agent Error"]}

def process_plan(state: AgentState):
    """Handle Phase 3: Content Operations (Tasks, Calendar, Pipeline)."""
    from app.agents.operations_agent import run_operations_agent
    response = run_operations_agent(state["messages"])
    return {"messages": [response], "actions_taken": ["Processed via Operations Agent"]}

def process_analyze(state: AgentState):
    """Handle Phase 3: Analytics and Reports."""
    from app.agents.analytics_agent import run_analytics_agent
    response = run_analytics_agent(state["messages"])
    return {"messages": [response], "actions_taken": ["Processed via Analytics Agent"]}

def process_create(state: AgentState):
    """Handle Phase 2: Creative Intelligence."""
    from app.agents.creative_agent import run_creative_agent
    response = run_creative_agent(state["messages"])
    return {"messages": [response], "actions_taken": ["Processed via Creative Agent"]}

# Routing function
def route_intent(state: AgentState) -> str:
    intent = state.get("intent", "CHAT")
    if intent == "RESEARCH":
        return "process_research"
    elif intent == "PLAN":
        return "process_plan"
    elif intent == "CREATE":
        return "process_create"
    elif intent == "ANALYZE":
        return "process_analyze"
    else:
        return "process_chat"

# Build the graph
workflow = StateGraph(AgentState)

workflow.add_node("analyze_intent", analyze_intent)
workflow.add_node("process_chat", process_chat)
workflow.add_node("process_research", process_research)
workflow.add_node("process_plan", process_plan)
workflow.add_node("process_create", process_create)
workflow.add_node("process_analyze", process_analyze)

# Edges
workflow.add_edge(START, "analyze_intent")
workflow.add_conditional_edges(
    "analyze_intent",
    route_intent,
    {
        "process_chat": "process_chat",
        "process_research": "process_research",
        "process_plan": "process_plan",
        "process_create": "process_create",
        "process_analyze": "process_analyze"
    }
)
workflow.add_edge("process_chat", END)
workflow.add_edge("process_research", END)
workflow.add_edge("process_plan", END)
workflow.add_edge("process_create", END)
workflow.add_edge("process_analyze", END)

# Compile
app = workflow.compile()
