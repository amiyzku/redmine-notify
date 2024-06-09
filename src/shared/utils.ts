export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0
}

export class ChromeUtils {
  static currentTab = async () => {
    const queryOptions = { active: true, currentWindow: true }
    const [tab] = await chrome.tabs.query(queryOptions)
    return tab
  }

  static currentURL = async (): Promise<URL | null> => {
    const tab = await ChromeUtils.currentTab()
    if (!tab || !tab.url) return null
    return new URL(tab.url)
  }
}
