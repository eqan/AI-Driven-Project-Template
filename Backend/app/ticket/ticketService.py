from ticket.models.ticket import Ticket
from ticket.dtos.ticket import TicketCreate, TicketUpdate, DeleteTicket
from database import session_scope

class TicketService:
    def create_ticket(self, ticket: TicketCreate):
        with session_scope() as session:
            session.add(Ticket(**ticket.model_dump()))
            return ticket

    def update_ticket(self, ticket: TicketUpdate):
        with session_scope() as session:
            session.query(Ticket).filter(Ticket.uuid == ticket.uuid).update(ticket.model_dump())
            return ticket

    def delete_ticket(self, ticket: DeleteTicket):
        with session_scope() as session:
            session.query(Ticket).filter(Ticket.uuid == ticket.uuid).delete()
            return ticket

    def get_ticket(self, uuid: str):
        with session_scope() as session:
            return session.query(Ticket).filter(Ticket.uuid == uuid).first()

    def get_all_tickets_by_user_id(self, user_id: int):
        with session_scope() as session:
            return session.query(Ticket).filter(Ticket.user_id == user_id).all()

ticket_service = TicketService()
