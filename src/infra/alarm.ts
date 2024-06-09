import URI from '../domain/models/ticket/uri'
import Ticket from '../domain/models/ticket/ticket'

type AlarmName = string

export interface Alarm {
  create(ticket: Ticket): Promise<void>
  delete(uri: URI): Promise<void>
  update(ticket: Ticket): Promise<void>
  exists(uri: URI): Promise<boolean>
  findAll(): Promise<AlarmName[]>
  deleteAll(): Promise<void>
}

export class ChromeAlarm implements Alarm {
  async create(ticket: Ticket): Promise<void> {
    if (await this.exists(ticket.uri)) return
    const MIN = 0.5
    await chrome.alarms.create(ticket.uri.value.toString(), {
      // delayInMinutes: 初回イベント発生までの遅延時間
      delayInMinutes: MIN,
      // periodInMinutes: 初回イベント発生後からの実行間隔
      periodInMinutes: ticket.poolingIntervalSec.minute,
    })
  }

  async delete(uri: URI): Promise<void> {
    await chrome.alarms.clear(uri.value.toString())
  }

  async update(ticket: Ticket): Promise<void> {
    await this.delete(ticket.uri)
    await this.create(ticket)
  }

  async exists(uri: URI): Promise<boolean> {
    let exists = false
    try {
      if (await chrome.alarms.get(uri.value.toString())) exists = true
    } catch (error) {
      return false
    }

    return exists
  }

  async findAll(): Promise<string[]> {
    let alarms: chrome.alarms.Alarm[] = []
    try {
      alarms = await chrome.alarms.getAll()
    } catch (error) {
      return []
    }

    const names = alarms.map((a) => {
      return a.name
    })
    return names
  }

  async deleteAll(): Promise<void> {
    await chrome.alarms.clearAll()
  }
}

export class InMemoryAlarm implements Alarm {
  private alarms: Record<string, { delayInMinutes: number; periodInMinutes: number }> = {}

  async create(ticket: Ticket): Promise<void> {
    this.alarms[ticket.uri.value.toString()] = {
      delayInMinutes: 0.5,
      periodInMinutes: ticket.poolingIntervalSec.minute,
    }
  }

  async delete(uri: URI): Promise<void> {
    delete this.alarms[uri.value.toString()]
  }

  async update(ticket: Ticket): Promise<void> {
    await this.delete(ticket.uri)
    await this.create(ticket)
  }

  async exists(uri: URI): Promise<boolean> {
    return uri.value.toString() in this.alarms
  }

  async findAll(): Promise<string[]> {
    return Object.keys(this.alarms)
  }

  async deleteAll(): Promise<void> {
    this.alarms = {}
  }
}
