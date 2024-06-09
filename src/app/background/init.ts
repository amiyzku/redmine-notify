import { AlarmUseCase } from '../../service/alarmUseCase'
import Message from '../../shared/message'

const init = async () => {
  Message.info(`Initialize application`).writeConsole()

  const alarmUseCase = new AlarmUseCase()

  // 通知(chrome.alarm)の初期化
  const message = await alarmUseCase.reloadAll()
  message.writeConsole()

  // service workerの保持
  await alarmUseCase.ensureKeepAliveAlarm()
}

export default init
