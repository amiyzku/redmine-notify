import { describe, it, expect } from 'vitest'
import Ticket from './ticket'
import URI from './uri'
import Tracker from './tracker'
import Title from './title'
import Status from './status'
import Priority from './priority'
import PersonInCharge from './personInCharge'
import Note from './note'
import NotificationStatus from './notificationStatus'
import PoolingIntervalSec from './poolingIntervalSec'
import NoteNumber from './noteNumber'

describe('Ticket', () => {
  describe('constructor', () => {
    it('creates an instance with valid arguments', () => {
      const ticket = new Ticket(
        new URI('https://example.com/'),
        new Tracker('Bug'),
        new Title('Bug Report'),
        new Status('Open'),
        new Priority('High'),
        new PersonInCharge('John Doe'),
        [new Note(new NoteNumber(1), 'Initial note')],
        new NotificationStatus('enable'),
        new PoolingIntervalSec(60),
      )
      expect(ticket.uri.value).toBe('https://example.com/')
      expect(ticket.tracker.value).toBe('Bug')
      expect(ticket.title.value).toBe('Bug Report')
      expect(ticket.status.value).toBe('Open')
      expect(ticket.priority.value).toBe('High')
      expect(ticket.personInCharge.value).toBe('John Doe')
      expect(ticket.noteList[0].content).toBe('Initial note')
      expect(ticket.notificationStatus.value).toBe('enable')
      expect(ticket.poolingIntervalSec.second).toBe(60)
    })
  })

  describe('equals', () => {
    it('returns true if both Ticket instances have the same uri', () => {
      const ticket1 = new Ticket(
        new URI('https://example.com'),
        new Tracker('Bug'),
        new Title('Bug Report'),
        new Status('Open'),
        new Priority('High'),
        new PersonInCharge('John Doe'),
        [],
        new NotificationStatus('enable'),
        new PoolingIntervalSec(60),
      )
      const ticket2 = new Ticket(
        new URI('https://example.com'),
        new Tracker('Bug'),
        new Title('Bug Report'),
        new Status('Open'),
        new Priority('High'),
        new PersonInCharge('John Doe'),
        [],
        new NotificationStatus('enable'),
        new PoolingIntervalSec(60),
      )
      const result = ticket1.equals(ticket2)
      expect(result).toBe(true)
    })

    it('returns false if Ticket instances have different uri', () => {
      const ticket1 = new Ticket(
        new URI('https://example.com'),
        new Tracker('Bug'),
        new Title('Bug Report'),
        new Status('Open'),
        new Priority('High'),
        new PersonInCharge('John Doe'),
        [],
        new NotificationStatus('enable'),
        new PoolingIntervalSec(60),
      )
      const ticket2 = new Ticket(
        new URI('https://example2.com'),
        new Tracker('Bug'),
        new Title('Bug Report'),
        new Status('Open'),
        new Priority('High'),
        new PersonInCharge('John Doe'),
        [],
        new NotificationStatus('enable'),
        new PoolingIntervalSec(60),
      )
      const result = ticket1.equals(ticket2)
      expect(result).toBe(false)
    })
  })
})
