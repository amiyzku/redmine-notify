import URI from '../../domain/models/ticket/uri'
import Ticket from '../../domain/models/ticket/ticket'
import { TicketRepo } from './ticketRepo'

export class TicketRepoInMemory implements TicketRepo {
  private store: Record<string, string> = {}

  async save(ticket: Ticket): Promise<void> {
    this.store[ticket.uri.value.toString()] = ticket.toJson()
  }

  async find(uri: URI): Promise<Ticket | null> {
    const jsonText = this.store[uri.value.toString()]
    if (!jsonText) return null
    return Ticket.fromJson(jsonText)
  }

  async findAll(): Promise<Ticket[]> {
    return Object.values(this.store).map((jsonText) => Ticket.fromJson(jsonText))
  }

  async delete(uri: URI): Promise<void> {
    delete this.store[uri.value.toString()]
  }
}
