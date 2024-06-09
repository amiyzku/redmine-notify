import Message, { ErrorMessage, InfoMessage } from '../shared/message'
import { TicketRepo } from '../infra/repo/ticketRepo'
import { Alarm, ChromeAlarm } from '../infra/alarm'
import { TicketRepoChromeStorage } from '../infra/repo/ticketRepoChromeStorage'

export const KEEP_ALIVE_ALARM_NAME = 'keep-alive'

export class AlarmUseCase {
  constructor(
    private readonly ticketRepository: TicketRepo = new TicketRepoChromeStorage(),
    private readonly alarm: Alarm = new ChromeAlarm(),
  ) {}

  public async reloadAll(): Promise<InfoMessage | ErrorMessage> {
    const tickets = await this.ticketRepository.findAll()
    if (tickets instanceof ErrorMessage) return tickets

    for (const ticket of tickets) {
      const exist = await chrome.alarms.get(ticket.uri.value.toString())
      if (!exist) {
        await this.alarm.create(ticket)
      }
    }

    return Message.info('Reload all alarms')
  }

  public async ensureKeepAliveAlarm(): Promise<void> {
    const keepAliveAlarm = await chrome.alarms.get(KEEP_ALIVE_ALARM_NAME)
    if (!keepAliveAlarm) {
      const MIN = 0.5
      await chrome.alarms.create(KEEP_ALIVE_ALARM_NAME, {
        delayInMinutes: MIN,
        periodInMinutes: MIN,
      })
    }
  }
}
