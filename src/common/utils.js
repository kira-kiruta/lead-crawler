import {
  DAY_MS,
  DEFAULT_INVITES_LIMIT,
  DEFAULT_TIME_INTERVAL,
  SECOND_CIRCLE_CONNECTIONS_TYPE,
  THIRD_CIRCLE_CONNECTIONS_TYPE,
} from './const';

const { remove } = chrome.tabs;
const { local } = chrome.storage;

export const setCurrentTabId = (id) =>
  new Promise(resolve => local.set({ currentTabId: id }, resolve));

export const getCurrentTabId = () =>
  new Promise(resolve => local.get('currentTabId', ({ currentTabId }) => resolve(currentTabId)));

export const getSettings = () =>
  new Promise(resolve =>
    local.get('settings', ({ settings }) => resolve(settings || getDefaultSettings()))
  );

export const getDefaultSettings = () => ({
  note: '',
  search: '',
  locations: [],
  invitesLimit: DEFAULT_INVITES_LIMIT,
  timeInterval: DEFAULT_TIME_INTERVAL,
  type: [SECOND_CIRCLE_CONNECTIONS_TYPE, THIRD_CIRCLE_CONNECTIONS_TYPE],
});

export const getInvites = () =>
  new Promise(resolve => local.get(['invites', 'currentSessionInvites'], ({ invites, currentSessionInvites }) => {
    const data = invites ? {
      invites: filterInvites(invites),
      currentSessionInvites,
    } : {
      invites: [],
      currentSessionInvites,
    };

    resolve(data);
  }));

export const saveInvite = () =>
  new Promise(resolve =>
    getInvites().then(({ invites, currentSessionInvites }) => {
      const updatedInvites = filterInvites(invites);
      const newInvite = { timestamp: Date.now() };
      updatedInvites.push(newInvite);
      console.log('CURRENT: ', currentSessionInvites);
      local.set({
        invites: updatedInvites,
        currentSessionInvites: currentSessionInvites + 1,
      }, () => resolve());
    })
  );

export const clearCurrentSession = () =>
  new Promise(resolve => local.set({ currentSessionInvites: 0 }, resolve));

export const closeCurrentSession = () =>
  new Promise(resolve => getCurrentTabId().then(tabId => remove(tabId, resolve)));

const filterInvites = invites => invites.filter(({ timestamp }) => (Date.now() - timestamp) < DAY_MS);
