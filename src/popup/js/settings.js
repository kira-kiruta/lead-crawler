import {
  DEFAULT_INVITES_LIMIT,
  DEFAULT_TIME_INTERVAL,
} from './../../common/const';

const { local } = chrome.storage;

export const getSettings = () => new Promise(resolve =>
  local.get('settings', response =>
    resolve(response.settings || {
      invitesLimit: DEFAULT_INVITES_LIMIT,
      timeInterval: DEFAULT_TIME_INTERVAL,
    })
  )
);

// export const fillSettings = () => {
//   const
// };