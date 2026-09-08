from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from chatbot.dtos.chatbot import ChatbotRequest
from chatbot.dtos.chatbot_response import ChatbotResponse
from config.config import limiter
from config.settings import settings
from chatbot.chatbotService import chatbot_service
from dependencies.auth import require_authenticated_user_id
from utils.security import enforce_payload_size

router = APIRouter()

@router.post("/chatbot-response", response_model=ChatbotResponse, dependencies=[Depends(enforce_payload_size)], tags=["Chatbot"])
@limiter.limit(settings.runtime.rate_limits.chatbot)
async def chatbot_response(chatbot_request: ChatbotRequest, request: Request, user_id: int = Depends(require_authenticated_user_id)):
    """Non-streaming chatbot endpoint (backward-compatible). Returns a single JSON response."""
    return await chatbot_service.generate_result(chatbot_request, user_id)


@router.post("/chatbot-response/stream", dependencies=[Depends(enforce_payload_size)], tags=["Chatbot"])
@limiter.limit(settings.runtime.rate_limits.chatbot_stream)
async def chatbot_response_stream(
    chatbot_request: ChatbotRequest,
    request: Request,
    user_id: int = Depends(require_authenticated_user_id),
):
    """SSE streaming chatbot endpoint using a two-phase architecture.

    Phase 1 (Intent Classification):
        A lightweight Gemini call classifies the user's intent as
        "regular", "booking", or "handoff" (~200-500ms).

    Phase 2 (Conditional Response):
        - regular  -> streams text tokens via Gemini streamGenerateContent
        - booking  -> single action event with acknowledgment text
        - handoff  -> creates ticket, single action event with ticket UUID

    SSE Event Protocol:
        event: intent  -> {"type": "regular"|"booking"|"handoff"}
        event: token   -> {"text": "chunk"}
        event: action  -> {"type":..., "response":..., "ticket_uuid":...}
        event: done    -> {"is_booking": bool, "is_human_handoff": bool}
        event: error   -> {"message": str, "code": int}
    """
    return StreamingResponse(
        chatbot_service.stream_response_sse(chatbot_request, user_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
    
@router.get("/all-chats", tags=["Chatbot"])
async def get_all_chats_endpoint(request: Request, user_id: int = Depends(require_authenticated_user_id)):
    """
    This endpoint returns all chats for a user.\n
    Body Parameters:
    - token: str
        The token for authentication.
    """
    return await chatbot_service.get_all_chats(user_id)
