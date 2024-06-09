import Ticket from '../../domain/models/ticket/ticket'
import URI from '../../domain/models/ticket/uri'

export interface TicketRepo {
  save(ticket: Ticket): Promise<void>
  find(uri: URI): Promise<Ticket | null>
  findAll(): Promise<Ticket[]>
  delete(uri: URI): Promise<void>
}
