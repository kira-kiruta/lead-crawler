import {
  DAY_MS,
  DEFAULT_INVITES_LIMIT,
  DEFAULT_TIME_INTERVAL,
} from './const';

const { local } = chrome.storage;

export const getSettings = () =>
  new Promise(resolve =>
    local.get('settings', ({ settings }) =>
      resolve(settings || {
        invitesLimit: DEFAULT_INVITES_LIMIT,
        timeInterval: DEFAULT_TIME_INTERVAL,
      })
    )
  );

export const getInvites = () =>
  new Promise(resolve => local.get('invites', ({ invites }) => {
    if (!invites) {
      resolve([]);
      return;
    }

    const lastInvites = filterInvites(invites);
    resolve(lastInvites);
  }));

export const saveInvite = () =>
  getInvites().then((invites) => {
    const updatedInvites = filterInvites(invites);
    const newInvite = { timestamp: Date.now() };
    updatedInvites.push(newInvite);
    local.set({ invites: updatedInvites });
  });

const filterInvites = (invites) => invites.filter(({ timestamp }) => (Date.now() - timestamp) < DAY_MS);
