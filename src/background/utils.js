const { local } = chrome.storage;

export const isCurrentTab = (tabId) =>
  new Promise(resolve => local.get('currentTabId', response => resolve(tabId === response.currentTabId)));
