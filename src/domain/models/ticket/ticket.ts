import Note from './note'
import NoteNumber from './noteNumber'
import NotificationStatus from './notificationStatus'
import PersonInCharge from './personInCharge'
import PoolingIntervalSec from './poolingIntervalSec'
import Priority from './priority'
import URI from './uri'
import Status from './status'
import Title from './title'
import Tracker from './tracker'

export type BulkUpdatable = {
  tracker: Tracker
  title: Title
  status: Status
  priority: Priority
  personInCharge: PersonInCharge
  noteList: Note[]
  notificationStatus: NotificationStatus
  poolingIntervalSec: PoolingIntervalSec
}

export default class Ticket {
  private readonly _uri: URI
  private _tracker: Tracker
  private _title: Title
  private _status: Status
  private _priority: Priority
  private _personInCharge: PersonInCharge
  private _noteList: Note[]

  private _notificationStatus: NotificationStatus
  private _poolingIntervalSec: PoolingIntervalSec

  constructor(
    uri: URI,
    tracker: Tracker,
    title: Title,
    status: Status,
    priority: Priority,
    personInCharge: PersonInCharge,
    noteList: Note[] = [],
    notificationStatus: NotificationStatus = new NotificationStatus(),
    poolingIntervalSec: PoolingIntervalSec = new PoolingIntervalSec(60),
  ) {
    this._uri = uri
    this._tracker = tracker
    this._title = title
    this._status = status
    this._priority = priority
    this._personInCharge = personInCharge
    this._noteList = noteList
    this._notificationStatus = notificationStatus
    this._poolingIntervalSec = poolingIntervalSec
  }

  get uri() {
    return this._uri
  }

  get tracker() {
    return this._tracker
  }

  get title() {
    return this._title
  }

  get status() {
    return this._status
  }

  get priority() {
    return this._priority
  }

  get personInCharge() {
    return this._personInCharge
  }

  get noteList() {
    return this._noteList
  }

  get notificationStatus() {
    return this._notificationStatus
  }

  get poolingIntervalSec() {
    return this._poolingIntervalSec
  }

  public equals(other: Ticket): boolean {
    return this.uri.equals(other.uri)
  }

  public bulkUpdate(values: Partial<BulkUpdatable>): Ticket {
    if (values?.tracker) this._tracker = values.tracker
    if (values?.title) this._title = values.title
    if (values?.status) this._status = values.status
    if (values?.priority) this._priority = values.priority
    if (values?.personInCharge) this._personInCharge = values.personInCharge
    if (values?.notificationStatus) this._notificationStatus = values.notificationStatus
    if (values?.poolingIntervalSec) this._poolingIntervalSec = values.poolingIntervalSec
    if (values?.noteList) {
      for (const note of values.noteList) {
        this.updateNote(note)
      }
    }

    return this
  }

  public addNote(note: Note): void {
    this._noteList.push(note)
  }

  private updateNote(note: Note): void {
    const index = this._noteList.findIndex((n) => n.number.equals(note.number))
    if (index !== -1) {
      this._noteList[index] = note
    }
  }

  public toJson() {
    return JSON.stringify(this)
  }

  public static fromJson(json: string): Ticket {
    const obj = JSON.parse(json)
    const noteList: Note[] = []
    for (const note of obj._noteList) {
      noteList.push(new Note(new NoteNumber(note._number._value), note._content))
    }

    const ticket = new Ticket(
      new URI(obj._uri._value),
      new Tracker(obj._tracker._value),
      new Title(obj._title._value),
      new Status(obj._status._value),
      new Priority(obj._priority._value),
      new PersonInCharge(obj._personInCharge._value),
      noteList,
      new NotificationStatus(obj._notificationStatus._value),
      new PoolingIntervalSec(obj._poolingIntervalSec._value),
    )
    return ticket
  }
}
