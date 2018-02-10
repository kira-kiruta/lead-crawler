const { local } = chrome.storage;

export const isCurrentTab = (tabId) => {
  return new Promise((resolve, reject) => {
    local.get('currentTabId', (response) => {
      resolve(tabId === response.currentTabId);
    });
  });
};
