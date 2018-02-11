const { local } = chrome.storage;
const DAY_MS = 24 * 60 * 60 * 1000;

export const isCurrentTab = (tabId) =>
  new Promise(resolve => local.get('currentTabId', response => resolve(tabId === response.currentTabId)));

export const getCurrentInvitesNumber = () =>
  new Promise(resolve => local.get('invites', ({ invites }) => {
    if (!invites) {
      resolve(0);
      return;
    }

    const lastInvites = invites.filter(({ timestamp }) => (Date.now() - timestamp) < DAY_MS);
    resolve(lastInvites.length);
  }));
