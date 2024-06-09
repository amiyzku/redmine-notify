import ArgumentException from '../../../shared/errors/argumentException'

export default class NotificationStatus {
  private readonly _value: 'enable' | 'disable'

  constructor(value: 'enable' | 'disable' = 'enable') {
    if (typeof value !== 'string') throw new ArgumentException(`${NotificationStatus.name}は文字列です。`)
    if (value !== 'enable' && value !== 'disable') {
      throw new ArgumentException(`${NotificationStatus.name}は'enable'か'disable'です。`)
    }
    this._value = value
  }

  get value(): 'enable' | 'disable' {
    return this._value
  }

  public equals(other: NotificationStatus): boolean {
    return this.value === other.value
  }
}
