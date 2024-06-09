import ArgumentException from '../../../shared/errors/argumentException'

export default class URI {
  private readonly _value: string

  constructor(value: string) {
    if (typeof value !== 'string') throw new ArgumentException(`${URI.name}は文字列です。`)
    if (value.length < 1) throw new ArgumentException(`${URI.name}は1以上です。`)
    let url: URL
    try {
      url = new URL(value)
    } catch (error) {
      throw new ArgumentException(`${URI.name}はURLではありません。`)
    }
    this._value = `${url.origin}${url.pathname}`
  }

  get value() {
    return this._value
  }

  public equals(other: URI): boolean {
    return this.value === other.value
  }
}
