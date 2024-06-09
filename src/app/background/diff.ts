import { TicketData } from '../../service/dto/ticketData'
import { isEmptyObject } from '../../shared/utils'

interface Diff<T> {
  prev: T
  current: T
}

interface NoteUpdateSummary {
  summary: 'new' | 'updated'
  number: Diff<TicketData['noteList'][number]['number']>
  content: Diff<TicketData['noteList'][number]['content']>
}

export interface TicketDiff {
  tracker: Diff<TicketData['tracker']>
  title: Diff<TicketData['title']>
  status: Diff<TicketData['status']>
  priority: Diff<TicketData['priority']>
  personInCharge: Diff<TicketData['personInCharge']>
  noteUpdateSummary: Array<NoteUpdateSummary>
}

export const diffTicket = (
  storedTicketData: Omit<TicketData, 'notificationStatus' | 'poolingIntervalSec'>,
  fetchedTicket: Omit<TicketData, 'notificationStatus' | 'poolingIntervalSec'>,
): Partial<TicketDiff> | null => {
  const diff: Partial<TicketDiff> = {}

  if (storedTicketData.tracker !== fetchedTicket.tracker) {
    diff.tracker = {
      prev: storedTicketData.tracker,
      current: fetchedTicket.tracker,
    }
  }

  if (storedTicketData.title !== fetchedTicket.title) {
    diff.title = {
      prev: storedTicketData.title,
      current: fetchedTicket.title,
    }
  }

  if (storedTicketData.status !== fetchedTicket.status) {
    diff.status = {
      prev: storedTicketData.status,
      current: fetchedTicket.status,
    }
  }

  if (storedTicketData.priority !== fetchedTicket.priority) {
    diff.priority = {
      prev: storedTicketData.priority,
      current: fetchedTicket.priority,
    }
  }

  if (storedTicketData.personInCharge !== fetchedTicket.personInCharge) {
    diff.personInCharge = {
      prev: storedTicketData.personInCharge,
      current: fetchedTicket.personInCharge,
    }
  }

  const noteUpdateSummary: NoteUpdateSummary[] = []
  for (const note of fetchedTicket.noteList) {
    const storedNote = storedTicketData.noteList.find((storedNote) => storedNote.number === note.number)
    if (!storedNote) {
      noteUpdateSummary.push({
        summary: 'new',
        number: {
          prev: NaN,
          current: note.number,
        },
        content: {
          prev: '',
          current: note.content,
        },
      })
    } else if (storedNote.content !== note.content) {
      noteUpdateSummary.push({
        summary: 'updated',
        number: {
          prev: note.number,
          current: note.number,
        },
        content: {
          prev: storedNote.content,
          current: note.content,
        },
      })
    }
  }
  if (noteUpdateSummary.length > 0) {
    diff.noteUpdateSummary = noteUpdateSummary
  }

  return isEmptyObject(diff) ? null : diff
}
