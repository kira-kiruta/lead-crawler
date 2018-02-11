import {
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
