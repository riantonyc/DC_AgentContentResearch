from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.agents.orchestrator.graph import app as orchestrator_app
from langchain_core.messages import HumanMessage

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    query: str
    project_id: Optional[str] = None
    # For MVP, we'll just accept a query. Later, we'll add conversation context.

class ChatResponse(BaseModel):
    response: str
    actions: List[str] = []

@router.post("/", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    """
    Endpoint untuk menerima pesan dari pengguna dan memprosesnya melalui AI Orchestrator.
    """
    query = request.query
    if not query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # Call LangGraph Orchestrator
    try:
        initial_state = {
            "messages": [HumanMessage(content=query)],
            "intent": "",
            "actions_taken": []
        }
        
        # Invoke the graph
        final_state = orchestrator_app.invoke(initial_state)
        
        # Get the last message content
        response_text = final_state["messages"][-1].content
        actions = final_state.get("actions_taken", [])
        
    except Exception as e:
        response_text = f"Internal Error: {str(e)}"
        actions = []
    
    return ChatResponse(
        response=response_text,
        actions=actions
    )
