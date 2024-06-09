import ArgumentException from "../../../shared/errors/argumentException"

export default class Priority {
  private readonly _value: string

  constructor(value: string) {
    if (typeof value !== 'string') throw new ArgumentException(`${Priority.name}は文字列です。`)
    if (value.length === 0) throw new ArgumentException(`${Priority.name}は1文字以上です。`)
    this._value = value
  }

  get value(): string {
    return this._value
  }

  public equals(other: Priority): boolean {
    return this.value === other.value
  }
}
