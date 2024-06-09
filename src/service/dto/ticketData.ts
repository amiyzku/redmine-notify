import Note from '../../domain/models/ticket/note'
import Ticket from '../../domain/models/ticket/ticket'

export interface TicketData {
  uri: string
  tracker: string
  title: string
  status: string
  priority: string
  personInCharge: string
  noteList: NoteData[]
  notificationStatus: 'enable' | 'disable'
  poolingIntervalSec: number
}
export interface NoteData {
  number: number
  content: string
}

export interface TicketDataWithMeta extends TicketData {
  noteList: NoteDataWithMeta[]
}

export interface NoteDataWithMeta extends NoteData {
  isSelfPosted: boolean
}

export const toNoteData = (note: Note): Readonly<NoteData> => {
  return {
    number: note.number.value,
    content: note.content,
  } as const
}

export const toTicketData = (ticket: Ticket): Readonly<TicketData> => {
  return {
    uri: ticket.uri.value,
    tracker: ticket.tracker.value,
    title: ticket.title.value,
    status: ticket.status.value,
    priority: ticket.priority.value,
    personInCharge: ticket.personInCharge.value,
    noteList: ticket.noteList.map((note) => toNoteData(note)),
    notificationStatus: ticket.notificationStatus.value,
    poolingIntervalSec: ticket.poolingIntervalSec.second,
  } as const
}
