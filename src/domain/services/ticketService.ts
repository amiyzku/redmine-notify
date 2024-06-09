import { TicketRepo } from '../../infra/repo/ticketRepo'
import Ticket from '../models/ticket/ticket'

export class TicketService {
  private readonly _ticketRepository: TicketRepo

  constructor(ticketRepository: TicketRepo) {
    this._ticketRepository = ticketRepository
  }

  public async exists(ticket: Ticket): Promise<boolean> {
    const duplicate = await this._ticketRepository.find(ticket.uri)
    return duplicate ? true : false
  }
}
