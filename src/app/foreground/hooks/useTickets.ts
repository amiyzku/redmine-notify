import { useEffect, useState } from 'react'
import { TicketData } from '../../../service/dto/ticketData'
import { TicketUseCase } from '../../../service/ticketUseCase'
import { ErrorMessage } from '../../../shared/message'
import { useAlert } from '../components/AlertContext'
import { ChromeUtils } from '../../../shared/utils'

const useTickets = () => {
  const [tickets, setTickets] = useState<TicketData[]>([])
  const { showAlert } = useAlert()

  const ticketUseCase = new TicketUseCase()

  useEffect(() => {
    ;(async () => {
      const result = await ticketUseCase.findAll()
      if (result instanceof ErrorMessage) {
        showAlert(result.displayText, 'error')
        return
      }
      setTickets(result)
    })()
  }, [])

  const addTicket = async () => {
    // urlでフィルタリング
    const url = await ChromeUtils.currentURL()
    if (!url) {
      showAlert('Failed to get current page url', 'error')
      return
    }

    const ticketUseCase = new TicketUseCase()
    const ticketPage = await ticketUseCase.fetch(`${url.origin}${url.pathname}`)
    if (ticketPage instanceof ErrorMessage) {
      showAlert(ticketPage.displayText, 'error')
      return
    }

    const parsedTicket = ticketUseCase.parse(ticketPage)
    if (!parsedTicket) return

    const ticketCreateResult = await ticketUseCase.create({
      ...parsedTicket,
    })
    if (ticketCreateResult instanceof ErrorMessage) {
      showAlert(ticketCreateResult.displayText, 'error')
      return
    }

    setTickets([...tickets, ticketCreateResult])
  }

  const deleteTickets = async (uris: string[]) => {
    for (const uri of uris) {
      const deleteResult = await ticketUseCase.delete(uri)
      if (deleteResult instanceof ErrorMessage) {
        showAlert(deleteResult.displayText, 'error')
        return
      }
    }

    setTickets(tickets.filter((ticket) => !uris.includes(ticket.uri)))
  }

  const activateTickets = async (uris: string[]) => {
    const successfulResults: TicketData[] = []
    for (const uri of uris) {
      const activateResult = await ticketUseCase.update(uri, { notificationStatus: 'enable' })
      if (activateResult instanceof ErrorMessage) {
        showAlert(activateResult.displayText, 'error')
        return
      }
      successfulResults.push(activateResult)
    }

    setTickets((prev) => {
      return prev.map((ticket) => {
        const index = successfulResults.findIndex((t) => t.uri === ticket.uri)
        if (index === -1) return ticket
        return successfulResults[index]
      })
    })
  }

  const inactivateTickets = async (uris: string[]) => {
    const successfulResults: TicketData[] = []
    for (const uri of uris) {
      const inactivateResult = await ticketUseCase.update(uri, { notificationStatus: 'disable' })
      if (inactivateResult instanceof ErrorMessage) {
        showAlert(inactivateResult.displayText, 'error')
        return
      }
      successfulResults.push(inactivateResult)
    }

    setTickets((prev) => {
      return prev.map((ticket) => {
        const index = successfulResults.findIndex((t) => t.uri === ticket.uri)
        if (index === -1) return ticket
        return successfulResults[index]
      })
    })
  }

  return { tickets, addTicket, deleteTickets, activateTickets, inactivateTickets }
}

export default useTickets
