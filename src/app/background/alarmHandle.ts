import { KEEP_ALIVE_ALARM_NAME } from '../../service/alarmUseCase'
import { TicketUseCase } from '../../service/ticketUseCase'
import Message, { ErrorMessage } from '../../shared/message'
import { TicketDiff, diffTicket } from './diff'

const alarmHandle = async (alarm: chrome.alarms.Alarm) => {
  Message.info(`Received alarm: ${alarm.name}`).writeConsole()
  if (alarm.name === KEEP_ALIVE_ALARM_NAME) return

  // refNumberからTicketを取得
  const ticketUseCase = new TicketUseCase()
  const storedTicketData = await ticketUseCase.findByURI(alarm.name)
  if (storedTicketData instanceof ErrorMessage) {
    storedTicketData.writeConsole()
    return
  }

  // チケットページを取得
  const ticketPage = await ticketUseCase.fetch(storedTicketData.uri)
  if (ticketPage instanceof ErrorMessage) {
    ticketPage.writeConsole()
    return
  }

  // チケットデータをパース
  const parsedTicket = ticketUseCase.parse(ticketPage)

  // 自身が更新したチケットを除外する
  const excludeSelfPostedNoteList = parsedTicket.noteList.filter((note) => !note.isSelfPosted)
  const parsedTicketForDiff = {
    ...parsedTicket,
    noteList: excludeSelfPostedNoteList,
  }

  // 更新差分を取得
  const ticketDiff = diffTicket(storedTicketData, parsedTicketForDiff)

  // save
  ticketUseCase.update(storedTicketData.uri, parsedTicket)

  // judge
  if (ticketDiff === null) {
    Message.info(`#${storedTicketData.uri} No update`).writeConsole()
    return
  }

  // notify
  const lastNote = parsedTicketForDiff.noteList[parsedTicketForDiff.noteList.length - 1]
  const fragment = lastNote ? `#note-${lastNote.number}` : ''
  const notificationId = `${storedTicketData.uri}${fragment}`
  const notificationMessage = createNotificationMessage(ticketDiff)
  await chrome.notifications.create(notificationId, {
    type: 'basic',
    title: `${storedTicketData.tracker} #${storedTicketData.uri} ${storedTicketData.title}`,
    message: notificationMessage,
    iconUrl: 'https://raw.githubusercontent.com/edavis10/redmine_logo/master/favicon.ico',
  })
}
export default alarmHandle

const createNotificationMessage = (diff: Partial<TicketDiff> | null = null): string => {
  if (!diff) return ''

  const msg: string[] = []
  const separator = '\n\t'

  diff.tracker && msg.push(`【トラッカー】${separator}${diff.tracker.prev} -> ${diff.tracker.current}`)
  diff.title && msg.push(`【タイトル】${separator}${diff.title.prev} -> ${diff.title.current}`)
  diff.status && msg.push(`【状態】${separator}${diff.status.prev} -> ${diff.status.current}`)
  diff.priority && msg.push(`【優先度】${separator}${diff.priority.prev} -> ${diff.priority.current}`)
  diff.personInCharge && msg.push(`【担当者】${separator}${diff.personInCharge.prev} -> ${diff.personInCharge.current}`)

  for (const summary of diff.noteUpdateSummary || []) {
    if (summary.summary === 'new') {
      msg.push(`【新着のコメントがあります】${separator}${summary.content.current}`)
    } else if (summary.summary === 'updated') {
      msg.push(`【コメントの更新があります】${separator}${summary.content.current}`)
    }
  }

  return msg.join('\n')
}
