from fastapi import APIRouter, Depends, Request

from config.config import limiter
from config.settings import settings
from dependencies.auth import require_authenticated_user_id
from ticket.dtos.ticket import TicketUpdate
from ticket.ticketService import ticket_service
from utils.security import enforce_payload_size

router = APIRouter()
@router.put("/ticket", dependencies=[Depends(enforce_payload_size)], tags=["Ticket"])
@limiter.limit(settings.runtime.rate_limits.ticket)
async def update_ticket(
    ticket: TicketUpdate,
    request: Request,
):
    """
    This endpoint updates a ticket.\n
    Body Parameters:
    - uuid: str
        The UUID of the ticket to update.
    - status: str
        The status of the ticket to update.
    """
    return ticket_service.update_ticket(ticket)

@router.get("/ticket/{uuid}", tags=["Ticket"])
@limiter.limit(settings.runtime.rate_limits.ticket)
async def get_ticket(
    uuid: str,
    request: Request,
):
    """
    This endpoint gets a ticket by UUID.\n
    Body Parameters:
    - uuid: str
        The UUID of the ticket to get.
    """
    return ticket_service.get_ticket(uuid)

@router.get("/tickets", tags=["Ticket"])
@limiter.limit(settings.runtime.rate_limits.ticket)
async def get_all_tickets_by_user_id(
    request: Request,
    user_id: int = Depends(require_authenticated_user_id),
):
    """
    This endpoint gets all tickets for a user.\n
    Body Parameters:
    - token: str
        The token for authentication.
    """
    return ticket_service.get_all_tickets_by_user_id(user_id)
