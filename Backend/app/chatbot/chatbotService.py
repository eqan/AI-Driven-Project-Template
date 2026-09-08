import json
import re
import uuid
from datetime import datetime

from fastapi import HTTPException
from pydantic import ValidationError as ResponseValidationError
from sqlalchemy.exc import SQLAlchemyError

from chatbot.dtos.chatbot import ChatbotRequest
from chatbot.dtos.chatbot_response import ChatbotResponse
from chatbot.models.chat import Chat
from config.config import generation_config
from config.settings import settings
from database import session_scope
from ingestion.dtos.ingestion import SearchDTO
from ingestion.ingestionService import ingestion_service
from integrations.gemini_client import gemini_client
from prompts.load_prompt import load_prompt
from ticket.dtos.ticket import TicketCreate
from ticket.ticketService import TicketService


class ChatbotService:
    """Service encapsulating chatbot-related logic, LLM calls, and persistence."""

    def __init__(self):
        self.MAX_ATTEMPTS = 5
        self.ticket_service = TicketService()

    @staticmethod
    def _extract_json_from_parts(parts: list[dict]) -> str:
        for part in reversed(parts):
            if not isinstance(part, dict):
                continue
            txt = part.get("text", "")
            if "{" not in txt:
                continue
            cleaned = re.sub(r"```(?:json)?\s*|\s*```", "", txt).strip()
            m_start = cleaned.find("{")
            m_end = cleaned.rfind("}")
            if m_start != -1 and m_end != -1 and m_end > m_start:
                possible_json = cleaned[m_start : m_end + 1]
                try:
                    json.loads(possible_json)
                    return possible_json
                except json.JSONDecodeError:
                    continue
        raise ValueError("No JSON object found in LLM response parts")

    @staticmethod
    def _clean_and_parse_json(response_text: str) -> ChatbotResponse:
        cleaned_text = re.sub(r"```(?:json)?\s*|\s*```", "", response_text)
        cleaned_text = cleaned_text.replace('\\"', '"').strip()
        parsed_json = json.loads(cleaned_text)

        try:
            return ChatbotResponse(**parsed_json)
        except ResponseValidationError as e:
            raise json.JSONDecodeError(f"LLM response schema mismatch: {e}", cleaned_text, 0)

    def _build_history_contents(self, chat_history: list[dict]) -> list[dict]:
        return [
            {"role": turn["role"], "parts": [{"text": turn["content"]}]}
            for turn in chat_history
        ]

    def _build_payload(self, prompt: str, chatbot_request: ChatbotRequest, include_search_tools: bool = True) -> dict:
        payload = {
            "contents": [
                {"role": "model", "parts": [{"text": prompt}]}
            ] + self._build_history_contents(chatbot_request.chat_history) + [
                {"role": "user", "parts": [{"text": chatbot_request.message}]}
            ],
            "generationConfig": generation_config,
        }

        if include_search_tools:
            tools = gemini_client.google_search_tools()
            if tools:
                payload["tools"] = tools

        return payload

    def _fetch_relevant_content(self, message: str, website_url: str) -> str:
        relevant_content = ""
        try:
            data = ingestion_service.search_in_pinecone(
                SearchDTO(query=message, company_website=website_url, top_k=4)
            )
            for i, match in enumerate(data["matches"]):
                try:
                    metadata = match["metadata"]
                    relevant_content += (
                        f"Entry {i}: Title: {metadata['title']} "
                        f"Content Type: {metadata['content_type']} "
                        f"Section: {metadata['section']} "
                        f"Source URL: {metadata['source_url']} "
                        f"Content: {metadata['cleaned_content']} "
                        f"Metadata: {metadata['specific_metadata']}\n\n"
                    )
                except Exception as e:
                    print(f"Error reading match: {e}")
        except Exception as e:
            print(f"Pinecone search error: {e}")
        return relevant_content

    async def generate_result(self, chatbot_request: ChatbotRequest, user_id: int) -> ChatbotResponse:
        model_name = settings.model_name or "gemini-2.0-flash"
        relevant_content = self._fetch_relevant_content(chatbot_request.message, chatbot_request.website_url)

        prompt = load_prompt("response-generation")
        prompt = prompt.replace("{website_url}", chatbot_request.website_url)
        prompt = prompt.replace("{message}", chatbot_request.message)
        prompt = prompt.replace("{website_description}", chatbot_request.website_description)
        prompt = prompt.replace("{relevant_content}", relevant_content)

        payload = self._build_payload(prompt, chatbot_request, include_search_tools=True)
        last_error: Exception | None = None

        for attempt in range(1, self.MAX_ATTEMPTS + 1):
            try:
                data = gemini_client.generate_content(model_name, payload, timeout_seconds=60)
                parts = data["candidates"][0]["content"]["parts"]
                json_block = self._extract_json_from_parts(parts)
                response = self._clean_and_parse_json(json_block)
                chatbot_request.chat_history.append(
                    {
                        "role": "model",
                        "content": response.response,
                        "is_booking": response.is_booking,
                        "is_human_handoff": response.is_human_handoff,
                    }
                )
                await self.save_chat_history(chatbot_request, user_id)
                if response.is_human_handoff:
                    try:
                        ticket_uuid = "TICKET-" + str(uuid.uuid4())
                        self.ticket_service.create_ticket(
                            TicketCreate(
                                user_id=user_id,
                                message=chatbot_request.message,
                                session_id=chatbot_request.session_id,
                                uuid=ticket_uuid,
                            )
                        )
                        response.ticket_uuid = ticket_uuid
                    except Exception as e:
                        print(f"Error creating ticket: {e}")
                return response
            except (HTTPException, KeyError, IndexError, ValueError, json.JSONDecodeError) as err:
                last_error = err
                if attempt == self.MAX_ATTEMPTS:
                    if isinstance(err, (KeyError, IndexError)):
                        raise HTTPException(status_code=500, detail="Unexpected response structure from LLM")
                    raise err
                print(f"Retrying Gemini call after error: {err}")

        raise last_error if last_error else HTTPException(status_code=500, detail="Failed to get valid response from LLM")

    async def save_chat_history(self, chatbot_request: ChatbotRequest, user_id: int):
        try:
            with session_scope() as session:
                chat = session.query(Chat).filter(Chat.session_id == chatbot_request.session_id).first()
                if chat:
                    chat.message = chatbot_request.message
                    chat.chat_history = json.dumps(chatbot_request.chat_history)
                    chat.updated_at = datetime.utcnow()
                    session.flush()
                    session.refresh(chat)
                    return chat

                chat = Chat(
                    user_id=user_id,
                    session_id=chatbot_request.session_id,
                    message=chatbot_request.message,
                    chat_history=json.dumps(chatbot_request.chat_history),
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )
                session.add(chat)
                session.flush()
                session.refresh(chat)
                return chat
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_chat_history(self, session_id: str):
        try:
            with session_scope() as session:
                chat_history = session.query(Chat).filter(Chat.session_id == session_id).all()
                return chat_history or None
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_all_chats(self, user_id: int):
        try:
            with session_scope() as session:
                return session.query(Chat).filter(Chat.user_id == user_id).all()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def update_chat_history(self, chatbot_request: ChatbotRequest):
        try:
            with session_scope() as session:
                chat = session.query(Chat).filter(Chat.session_id == chatbot_request.session_id).first()
                if chat:
                    chat.message = chatbot_request.message
                    chat.chat_history = json.dumps(chatbot_request.chat_history)
                    chat.updated_at = datetime.utcnow()
                    session.flush()
                    session.refresh(chat)
                return chat
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def classify_intent(self, chatbot_request: ChatbotRequest) -> dict:
        model_name = settings.model_name or "gemini-2.5-flash"
        prompt = load_prompt("intent-classification")
        prompt = prompt.replace("{website_url}", chatbot_request.website_url)
        prompt = prompt.replace("{message}", chatbot_request.message)
        prompt = prompt.replace("{website_description}", chatbot_request.website_description)

        payload = {
            "contents": [
                {"role": "model", "parts": [{"text": prompt}]}
            ] + self._build_history_contents(chatbot_request.chat_history) + [
                {"role": "user", "parts": [{"text": chatbot_request.message}]}
            ],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 256,
                "responseMimeType": "text/plain",
            },
        }

        data = await gemini_client.generate_content_async(model_name, payload, timeout_seconds=30)

        try:
            parts = data["candidates"][0]["content"]["parts"]
            json_text = self._extract_json_from_parts(parts)
            result = json.loads(json_text)
        except Exception:
            return {"intent": "regular", "response": ""}

        intent = result.get("intent", "regular")
        if intent not in ("regular", "booking", "handoff"):
            intent = "regular"

        return {"intent": intent, "response": result.get("response", "")}

    async def stream_response_sse(self, chatbot_request: ChatbotRequest, user_id: int):
        model_name = settings.model_name or "gemini-2.5-flash"
        relevant_content = self._fetch_relevant_content(chatbot_request.message, chatbot_request.website_url)

        try:
            classification = await self.classify_intent(chatbot_request)
        except Exception as e:
            yield self._sse("error", {"message": str(e), "code": 500})
            return

        intent = classification["intent"]
        yield self._sse("intent", {"type": intent})

        if intent == "regular":
            prompt = load_prompt("response-streaming")
            prompt = prompt.replace("{website_url}", chatbot_request.website_url)
            prompt = prompt.replace("{message}", chatbot_request.message)
            prompt = prompt.replace("{website_description}", chatbot_request.website_description)
            prompt = prompt.replace("{relevant_content}", relevant_content)

            payload = self._build_payload(prompt, chatbot_request, include_search_tools=True)
            full_response = ""
            try:
                async for chunk in gemini_client.stream_generate_content(
                    model_name,
                    payload,
                    timeout_seconds=120,
                ):
                    parts = (
                        chunk.get("candidates", [{}])[0]
                        .get("content", {})
                        .get("parts", [])
                    )
                    for part in parts:
                        text = part.get("text", "")
                        if text:
                            full_response += text
                            yield self._sse("token", {"text": text})
            except HTTPException as e:
                yield self._sse("error", {"message": e.detail, "code": e.status_code})
                return
            except Exception as e:
                yield self._sse("error", {"message": str(e), "code": 500})
                return

            chatbot_request.chat_history.append(
                {
                    "role": "model",
                    "content": full_response,
                    "is_booking": False,
                    "is_human_handoff": False,
                }
            )
            await self.save_chat_history(chatbot_request, user_id)
            yield self._sse("done", {"is_booking": False, "is_human_handoff": False})

        elif intent == "booking":
            response_text = classification.get("response") or "I'd be happy to help you schedule that."
            chatbot_request.chat_history.append(
                {
                    "role": "model",
                    "content": response_text,
                    "is_booking": True,
                    "is_human_handoff": False,
                }
            )
            await self.save_chat_history(chatbot_request, user_id)
            yield self._sse("action", {"type": "booking", "response": response_text})
            yield self._sse("done", {"is_booking": True, "is_human_handoff": False})

        elif intent == "handoff":
            response_text = classification.get("response") or "Let me connect you with a human agent."
            ticket_uuid = None
            try:
                ticket_uuid = "TICKET-" + str(uuid.uuid4())
                self.ticket_service.create_ticket(
                    TicketCreate(
                        user_id=user_id,
                        message=chatbot_request.message,
                        session_id=chatbot_request.session_id,
                        uuid=ticket_uuid,
                    )
                )
            except Exception as e:
                print(f"Error creating ticket: {e}")

            chatbot_request.chat_history.append(
                {
                    "role": "model",
                    "content": response_text,
                    "is_booking": False,
                    "is_human_handoff": True,
                }
            )
            await self.save_chat_history(chatbot_request, user_id)

            action_data = {"type": "handoff", "response": response_text}
            if ticket_uuid:
                action_data["ticket_uuid"] = ticket_uuid
            yield self._sse("action", action_data)
            yield self._sse(
                "done",
                {
                    "is_booking": False,
                    "is_human_handoff": True,
                    "ticket_uuid": ticket_uuid,
                },
            )

    @staticmethod
    def _sse(event: str, data: dict) -> str:
        return f"event: {event}\ndata: {json.dumps(data)}\n\n"


chatbot_service = ChatbotService()
