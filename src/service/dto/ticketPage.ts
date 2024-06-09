export class TicketPage {
  public readonly url: string
  public readonly document: Document

  constructor(url: string, document: Document) {
    this.url = url
    this.document = document
  }
}
