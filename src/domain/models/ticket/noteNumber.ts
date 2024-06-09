import ArgumentException from "../../../shared/errors/argumentException"

export default class NoteNumber {
  private readonly _value: number

  constructor(value: number) {
    if (typeof value !== 'number') throw new ArgumentException(`${NoteNumber.name}は数値です。`)
    if (value < 1) throw new ArgumentException(`${NoteNumber.name}は1以上です。`)
    this._value = value
  }

  get value() {
    return this._value
  }

  public equals(other: NoteNumber) {
    return this.value === other.value
  }

  /**
   * #{{number}} 形式で返す
   * e.g. #2
   */
  public toDisplayString(): string {
    return `#${this._value}`
  }
}
