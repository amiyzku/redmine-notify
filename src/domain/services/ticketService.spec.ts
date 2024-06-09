import { describe, it, expect, beforeEach } from 'vitest'
import { TicketService } from './ticketService'
import Ticket from '../models/ticket/ticket'
import URI from '../models/ticket/uri'
import Tracker from '../models/ticket/tracker'
import Status from '../models/ticket/status'
import Priority from '../models/ticket/priority'
import PersonInCharge from '../models/ticket/personInCharge'
import Title from '../models/ticket/title'
import { TicketRepoInMemory } from '../../infra/repo/ticketRepoInMemory'

describe('TicketService', () => {
  let ticketRepository: TicketRepoInMemory
  let ticketService: TicketService

  beforeEach(() => {
    ticketRepository = new TicketRepoInMemory()
    ticketService = new TicketService(ticketRepository)
  })

  describe('exists method', () => {
    it('should return true if the ticket exists', async () => {
      const ticket = new Ticket(
        new URI('https://example.com'),
        new Tracker('tracker'),
        new Title('title'),
        new Status('status'),
        new Priority('priority'),
        new PersonInCharge('personInCharge'),
      )
      const ticketRepository = new TicketRepoInMemory()
      ticketRepository.save(ticket)
      ticketService = new TicketService(ticketRepository)

      const result = await ticketService.exists(ticket)
      expect(result).toBe(true)
    })

    it('should return false if the ticket does not exist', async () => {
      const ticket = new Ticket(
        new URI('https://example.com'),
        new Tracker('tracker'),
        new Title('title'),
        new Status('status'),
        new Priority('priority'),
        new PersonInCharge('personInCharge'),
      )
      ticketRepository.save(ticket)
      ticketService = new TicketService(ticketRepository)

      const ticket2 = new Ticket(
        new URI('https://example2.com'),
        new Tracker('tracker'),
        new Title('title'),
        new Status('status'),
        new Priority('priority'),
        new PersonInCharge('personInCharge'),
      )
      const result = await ticketService.exists(ticket2)
      expect(result).toBe(false)
    })
  })
})
