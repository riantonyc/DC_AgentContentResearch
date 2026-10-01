import os
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, BaseMessage
import operator

# State schema for the orchestrator agent
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    intent: str
    actions_taken: list[str]

# Define the nodes
def analyze_intent(state: AgentState):
    """Analyze the user's intent to decide which tools/agents to use."""
    last_message = state["messages"][-1]
    
    # In the future, use LLM to classify intent (e.g., RESEARCH, CREATE, PLAN).
    # For MVP Phase 1, we assume everything is a general Chat/Research query.
    
    return {"intent": "CHAT"}

from dotenv import load_dotenv

load_dotenv()

def process_chat(state: AgentState):
    """Generate a response using Gemini."""
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash", 
        temperature=0.7,
        api_key=os.getenv("GEMINI_API_KEY")
    )
    
    try:
        response = llm.invoke(state["messages"])
        return {"messages": [response], "actions_taken": ["Chat response generated"]}
    except Exception as e:
        # Fallback if API key is not set or fails
        error_msg = f"Sorry, I encountered an error connecting to the AI: {str(e)}"
        return {"messages": [error_msg], "actions_taken": ["Error handled"]}

# Build the graph
workflow = StateGraph(AgentState)

workflow.add_node("analyze_intent", analyze_intent)
workflow.add_node("process_chat", process_chat)

# Edges
workflow.add_edge(START, "analyze_intent")
workflow.add_edge("analyze_intent", "process_chat")
workflow.add_edge("process_chat", END)

# Compile
app = workflow.compile()
