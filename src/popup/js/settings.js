import {
  DEFAULT_INVITES_LIMIT,
  DEFAULT_TIME_INTERVAL,
} from './../../common/const';
import { getSettings } from './../../common/utils';

export const fillSettings = () =>
  getSettings().then(({ timeInterval, invitesLimit }) => {
    intervalField.value = timeInterval;
    invitesLimitField.value = invitesLimit;
  });

const { local } = chrome.storage;

const intervalField = document.getElementById('js-invites-interval');
const invitesLimitField = document.getElementById('js-invites-limit');

const saveSettingsButton = document.getElementById('js-save-settings');
const resetSettingsButton = document.getElementById('js-reset-settings');

const saveSettings = () =>
  new Promise((resolve) => {
    const settings = {
      timeInterval: intervalField.value,
      invitesLimit: invitesLimitField.value,
    };
    local.set({ settings }, resolve);
  });

const resetSettings = () =>
  new Promise((resolve) => {
    const settings = {
      timeInterval: DEFAULT_TIME_INTERVAL,
      invitesLimit: DEFAULT_INVITES_LIMIT,
    };
    intervalField.value = DEFAULT_TIME_INTERVAL;
    invitesLimitField.value = DEFAULT_INVITES_LIMIT;
    local.set({ settings }, resolve);
  });

saveSettingsButton.addEventListener('click', saveSettings);
resetSettingsButton.addEventListener('click', resetSettings);
