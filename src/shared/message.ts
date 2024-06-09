type DisplayText = string
type Options = {
  prefix?: string
  suffix?: string
}

export default class Message {
  public static info(text: DisplayText): InfoMessage {
    return new InfoMessage(text)
  }

  public static warning(text: DisplayText): WarningMessage {
    return new WarningMessage(text)
  }

  public static error(text: DisplayText): ErrorMessage {
    return new ErrorMessage(text)
  }
}

abstract class BaseMessage {
  constructor(private readonly _displayText: DisplayText) {}

  get displayText() {
    return this._displayText
  }

  protected _writeConsole(
    logFunction: (msg: string) => void,
    logLevel: 'info' | 'error' | 'warn',
    options?: Options,
  ): void {
    const { prefix = '', suffix = '' } = options ?? {}
    const json = JSON.stringify({
      level: logLevel,
      date: new Date().toLocaleString(),
      message: `${prefix}${this._displayText}${suffix}`,
    })
    logFunction(json)
  }
}

export class ErrorMessage extends BaseMessage {
  public writeConsole(options?: Options): void {
    super._writeConsole(console.error, 'error', options)
  }
}

export class InfoMessage extends BaseMessage {
  public writeConsole(options?: Options): void {
    super._writeConsole(console.info, 'info', options)
  }
}

export class WarningMessage extends BaseMessage {
  public writeConsole(options?: Options): void {
    super._writeConsole(console.warn, 'warn', options)
  }
}
