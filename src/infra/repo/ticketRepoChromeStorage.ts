import { getBucket } from '@extend-chrome/storage'
import { TicketRepo } from './ticketRepo'
import Ticket from '../../domain/models/ticket/ticket'
import URI from '../../domain/models/ticket/uri'

interface Store {
  [key: string]: string
}

export class TicketRepoChromeStorage implements TicketRepo {
  private _bucket: ReturnType<typeof getBucket<Store>>

  constructor() {
    this._bucket = getBucket<Store>(Ticket.name)
  }

  async save(ticket: Ticket): Promise<void> {
    try {
      await this._bucket.set({ [ticket.uri.value.toString()]: ticket.toJson() })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async find(uri: URI): Promise<Ticket | null> {
    const item = await this._bucket.get(uri.value.toString())
    const jsonText = item[uri.value.toString()]
    if (!jsonText) return null
    return Ticket.fromJson(jsonText)
  }

  async findAll(): Promise<Ticket[]> {
    const keys = await this._bucket.getKeys()
    const items: Ticket[] = []
    for (const key of keys) {
      const item = await this.find(new URI(key))
      if (item) items.push(item)
    }
    return items
  }

  async delete(uri: URI): Promise<void> {
    await this._bucket.remove(uri.value.toString())
  }
}
