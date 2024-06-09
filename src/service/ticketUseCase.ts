import { parseHTML } from 'linkedom'

import PersonInCharge from '../domain/models/ticket/personInCharge'
import Priority from '../domain/models/ticket/priority'
import URI from '../domain/models/ticket/uri'
import Status from '../domain/models/ticket/status'
import Ticket, { BulkUpdatable } from '../domain/models/ticket/ticket'
import Title from '../domain/models/ticket/title'
import Tracker from '../domain/models/ticket/tracker'
import { TicketService } from '../domain/services/ticketService'
import { TicketRepo } from '../infra/repo/ticketRepo'
import Message, { ErrorMessage, InfoMessage } from '../shared/message'
import { TicketData, TicketDataWithMeta, toTicketData } from './dto/ticketData'
import { TicketPage } from './dto/ticketPage'
import NotificationStatus from '../domain/models/ticket/notificationStatus'
import PoolingIntervalSec from '../domain/models/ticket/poolingIntervalSec'
import Note from '../domain/models/ticket/note'
import NoteNumber from '../domain/models/ticket/noteNumber'
import { Alarm, ChromeAlarm } from '../infra/alarm'
import { TicketRepoChromeStorage } from '../infra/repo/ticketRepoChromeStorage'

export class TicketUseCase {
  private readonly _ticketRepository: TicketRepo
  private readonly _ticketService: TicketService
  private readonly _alarm: Alarm

  constructor(
    ticketRepository: TicketRepo = new TicketRepoChromeStorage(),
    ticketService: TicketService = new TicketService(ticketRepository),
    alarm: Alarm = new ChromeAlarm(),
  ) {
    this._ticketRepository = ticketRepository
    this._ticketService = ticketService
    this._alarm = alarm
  }

  public async findAll(): Promise<TicketData[] | ErrorMessage> {
    let tickets = []
    try {
      tickets = await this._ticketRepository.findAll()
    } catch (error) {
      return Message.error('Failed to fetch all tickets')
    }

    return tickets.map((t) => toTicketData(t))
  }

  public async findByURI(uri: string): Promise<TicketData | ErrorMessage> {
    const _uri = new URI(uri)

    let ticket: Ticket | null = null
    try {
      ticket = await this._ticketRepository.find(_uri)
    } catch (error) {
      return Message.error('Failed to fetch ticket')
    }

    if (!ticket) return Message.error(`Ticket(uri:${uri}) not found`)
    return toTicketData(ticket)
  }

  public async create(
    data: Omit<TicketData, 'id' | 'notificationStatus' | 'poolingIntervalSec'>,
  ): Promise<TicketData | ErrorMessage> {
    const ticket = new Ticket(
      new URI(data.uri),
      new Tracker(data.tracker),
      new Title(data.title),
      new Status(data.status),
      new Priority(data.priority),
      new PersonInCharge(data.personInCharge),
      data.noteList.map((note) => new Note(new NoteNumber(note.number), note.content)),
    )

    let duplicate = false
    try {
      duplicate = await this._ticketService.exists(ticket)
    } catch (error) {
      console.error(error)
      return Message.error('Failed to check duplication')
    }
    if (duplicate) return Message.error('Already exists')

    try {
      this._ticketRepository.save(ticket)
    } catch (error) {
      return Message.error(`Failed to save ticket(ref:${ticket.uri})`)
    }

    this._alarm.create(ticket)

    return toTicketData(ticket)
  }

  public async update(
    uri: TicketData['uri'],
    data: Partial<Omit<TicketData, 'uri'>>,
  ): Promise<TicketData | ErrorMessage> {
    const ticket = await this._ticketRepository.find(new URI(uri))
    if (!ticket) return Message.error(`Ticket(uri:${uri}) not found`)

    const bulkUpdateData: Partial<BulkUpdatable> = {}
    if (data.tracker) bulkUpdateData.tracker = new Tracker(data.tracker)
    if (data.title) bulkUpdateData.title = new Title(data.title)
    if (data.status) bulkUpdateData.status = new Status(data.status)
    if (data.priority) bulkUpdateData.priority = new Priority(data.priority)
    if (data.personInCharge) bulkUpdateData.personInCharge = new PersonInCharge(data.personInCharge)
    if (data.notificationStatus) bulkUpdateData.notificationStatus = new NotificationStatus(data.notificationStatus)
    if (data.poolingIntervalSec) bulkUpdateData.poolingIntervalSec = new PoolingIntervalSec(data.poolingIntervalSec)
    if (data.noteList) {
      bulkUpdateData.noteList = data.noteList.map((note) => new Note(new NoteNumber(note.number), note.content))
    }

    const updatedTicket = ticket.bulkUpdate(bulkUpdateData)

    try {
      this._ticketRepository.save(updatedTicket)
    } catch (error) {
      return Message.error(`Failed to save ticket(uri:${ticket.uri})`)
    }

    if (data.notificationStatus === 'disable') {
      this._alarm.delete(updatedTicket.uri)
    } else if (data.notificationStatus === 'enable' || data.poolingIntervalSec) {
      this._alarm.update(updatedTicket)
    }

    return toTicketData(updatedTicket)
  }

  public async updateAll(data: Partial<TicketData>): Promise<InfoMessage | ErrorMessage> {
    const tickets = await this._ticketRepository.findAll()
    if (tickets instanceof ErrorMessage) return tickets

    for (const ticket of tickets) {
      await this.update(ticket.uri.value, data)
    }

    return Message.info('Updated all tickets')
  }

  public async delete(uri: string): Promise<InfoMessage | ErrorMessage> {
    const ticket = await this._ticketRepository.find(new URI(uri))
    if (!ticket) return Message.error(`Ticket(uri:${uri}) not found`)

    try {
      await this._ticketRepository.delete(new URI(uri))
    } catch (error) {
      return Message.error(`Failed to delete ticket(uri:${uri})`)
    }

    this._alarm.delete(new URI(uri))

    return Message.info('Deleted ticket')
  }

  public async fetch(uri: TicketData['uri']): Promise<TicketPage | ErrorMessage> {
    const res = await fetch(uri)
    if (!res.ok) return Message.error(`Failed to fetch ticket(uri:${uri})`)

    const htmlText = await res.text()
    const { document } = parseHTML(htmlText)

    return new TicketPage(uri, document)
  }

  public parse(ticketPageDocument: TicketPage): Omit<TicketDataWithMeta, 'notificationStatus' | 'poolingIntervalSec'> {
    const data: ReturnType<typeof this.parse> = {
      tracker: '',
      uri: ticketPageDocument.url,
      title: '',
      status: '',
      priority: '',
      personInCharge: '',
      noteList: [],
    }
    const document = ticketPageDocument.document

    const h2 = document.querySelector<HTMLHeadingElement>('h2')
    if (h2) {
      const [tracker] = h2.innerText.split(' ')
      data.tracker = tracker
    }

    const title = document.querySelector<HTMLHeadingElement>('.subject h3')
    if (title) {
      data.title = title.innerText.toString()
    }

    const status = document.querySelector<HTMLTableCellElement>('td.status')
    if (status) {
      data.status = status.innerText.toString()
    }

    const priority = document.querySelector<HTMLTableCellElement>('td.priority')
    if (priority) {
      data.priority = priority.innerText.toString()
    }

    const personInCharge = document.querySelector<HTMLTableCellElement>('td.assigned-to')
    if (personInCharge) {
      data.personInCharge = personInCharge.innerText.toString()
    }

    const increment = (function* () {
      let number = 1
      while (true) {
        yield number++
      }
    })()
    for (const i of increment) {
      const note = document.querySelector<HTMLDivElement>(`#note-${i}`)
      if (note) {
        const content = note.querySelector<HTMLParagraphElement>('p')
        const contextual = note.querySelector<HTMLDivElement>('.contextual')
        if (content) {
          data.noteList.push({
            number: i,
            content: content.innerText.toString(),
            isSelfPosted: contextual ? true : false,
          })
        }
      } else {
        break
      }
    }

    return data
  }
}
