import {
  PORT_NAME_POPUP,
  MESSAGE_LOGGED_IN,
  MESSAGE_NOT_LOGGED_IN,
  MESSAGE_UPDATE_INVITE_COUNTER,
  MESSAGE_SEND_FOUND_CONTACTS_AMOUNT,
  MESSAGE_REQUEST_FOUND_CONTACTS_AMOUNT,
} from './../../common/const';
import {
  getInvites,
  setCurrentTabId,
  getCurrentTabId,
  clearCurrentSession,
  closeCurrentSession,
} from './../../common/utils';
import { generateSearchURL } from './utils';
import SettingsController from './SettingsController';

const { onMessage } = chrome.runtime;
const { connect, get } = chrome.tabs;
const { create, update } = chrome.windows;

const warningMessage = document.getElementById('js-warning');
const stopButton = document.getElementById('js-stop-button');
const startButton = document.getElementById('js-start-button');
const totalInvitesNumber = document.getElementById('js-invites-number');
const foundContactsText = document.getElementById('js-found-contacts-text');
const foundContactsAmount = document.getElementById('js-found-contacts-amount');
const requiredContactsAmount = document.getElementById('js-required-invites-amount');
const currentSessionInvitesAmount = document.getElementById('js-current-session-invites-amount');

const setPortConnection = (tabId) => {
  const port = connect(tabId, { name: PORT_NAME_POPUP });

  port.onMessage.addListener((request) => {
    const { message, data } = request;

    switch (message) {
      case MESSAGE_UPDATE_INVITE_COUNTER: {
        currentSessionInvitesAmount.innerHTML = data.currentSessionInvites;
        break;
      }
      case MESSAGE_SEND_FOUND_CONTACTS_AMOUNT: {
        showFoundMessageAmount(data.amount);
        break;
      }
      default: {
        break;
      }
    }
  });

  port.onDisconnect.addListener(stopInviting);

  port.postMessage({ message: MESSAGE_REQUEST_FOUND_CONTACTS_AMOUNT });
};

const showFoundMessageAmount = (amount) => {
  foundContactsAmount.innerHTML = amount;
  requiredContactsAmount.innerText = settingsController.getSettings().invitesLimit;
  foundContactsText.classList.remove('hidden');
};

const hideFoundContactsAmount = () => {
  foundContactsText.classList.add('hidden');
};

const changeState = (action) => {
  const isStart = action === 'start';

  stopButton.classList[isStart ? 'remove' : 'add']('hidden');
  startButton.classList[isStart ? 'add' : 'remove']('hidden');

  if (isStart) {
    warningMessage.classList.add('hidden');
  } else {
    hideFoundContactsAmount();
  }
};

const startInviting = () =>
  settingsController.saveSettings().then(clearCurrentSession).then(() => {
    const { locations, search, types } = settingsController.getSettings();
    const url = generateSearchURL({ locations, search, types });
    setCurrentSessionInvitesAmount(0);
    create({ url, focused: false }, ({ id, tabs }) => {
      update(id, { focused: false });
      changeState('start');
      const tabId = tabs[0].id;
      setCurrentTabId(tabId).then(() =>
        window.setTimeout(() => setPortConnection(tabId), 3000)
      );
    });
  });

const stopInviting = () =>
  closeCurrentSession().then(() => changeState('stop'));

const connectToCurrentTab = (currentTabId) => {
  if (currentTabId) {
    get(currentTabId, (tab) => {
      if (tab) {
        changeState('start');
        setPortConnection(tab.id);
      } else {
        changeState('stop');
      }
    })
  }
};

const setCurrentSessionInvitesAmount = (currentSessionInvites) => {
  currentSessionInvitesAmount.innerHTML = currentSessionInvites || '0';
};

const setTotalInvitesAmount = (invites) => {
  totalInvitesNumber.innerHTML = invites;
};

const settingsController = new SettingsController();
getInvites().then(({ invites, currentSessionInvites }) => {
  setTotalInvitesAmount(invites.length);
  setCurrentSessionInvitesAmount(currentSessionInvites);
});
getCurrentTabId().then(connectToCurrentTab);


stopButton.addEventListener('click', stopInviting);
startButton.addEventListener('click', startInviting);

onMessage.addListener((request) => {
  switch(request.message) {
    case MESSAGE_LOGGED_IN: {
      warningMessage.classList.add('hidden');
      break;
    }
    case MESSAGE_NOT_LOGGED_IN: {
      stopInviting();
      warningMessage.classList.remove('hidden');
      break;
    }
    default: {
      break
    }
  }

  return true;
});
