import ArgumentException from '../../../shared/errors/argumentException'

export default class PoolingIntervalSec {
  private _value: number

  constructor(value: number) {
    if (typeof value !== 'number') throw new ArgumentException(`${PoolingIntervalSec.name}は数値です。`)
    if (value < 30) throw new ArgumentException(`${PoolingIntervalSec.name}は30以上です。`)
    this._value = value
  }

  get second() {
    return this._value
  }

  get minute() {
    return this._value / 60
  }

  public equals(other: PoolingIntervalSec) {
    return this.second === other.second
  }
}
