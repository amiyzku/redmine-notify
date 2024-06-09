import ArgumentException from '../../../shared/errors/argumentException'
import NoteNumber from './noteNumber'

/**
 * Redmineの履歴の1単位(#1,#2,#3がある場合、#1で1Note)
 * */
export default class Note {
  private readonly _number: NoteNumber
  private _content: string

  constructor(number: NoteNumber, content: string) {
    if (typeof content !== 'string') throw new ArgumentException('contentは文字列です。')
    this._number = number
    this._content = content
  }

  get number(): NoteNumber {
    return this._number
  }

  get content(): string {
    return this._content
  }

  public equals(other: Note): boolean {
    return this.number.equals(other.number) && this.content === other.content
  }
}
