import init from './init'
import alarmHandle from './alarmHandle'

chrome.runtime.onInstalled.addListener(() => {
  init()
})

chrome.runtime.onStartup.addListener(() => {
  init()
})

chrome.notifications.onClicked.addListener(async (notificationId) => {
  await chrome.tabs.create({ url: notificationId })
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  alarmHandle(alarm)
})
