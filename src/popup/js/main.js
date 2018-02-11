import {
  SEARCH_URL,
  PORT_NAME_POPUP,
  MESSAGE_LOGGED_IN,
  MESSAGE_NOT_LOGGED_IN,
  MESSAGE_UPDATE_INVITE_COUNTER,
} from './../../common/const';
import { getInvites, setCurrentTabId, getCurrentTabId } from './../../common/utils';
import { fillSettings } from './settings';

const { onMessage } = chrome.runtime;
const { connect, get, remove } = chrome.tabs;

const warningMessage = document.getElementById('js-warning');
const stopButton = document.getElementById('js-stop-button');
const startButton = document.getElementById('js-start-button');
const totalInvitesNumber = document.getElementById('js-invites-number');

const setPortConnection = (tabId) => {
  const port = connect(tabId, { name: PORT_NAME_POPUP });

  port.onMessage.addListener((request) => {
    switch (request.message) {
      case MESSAGE_UPDATE_INVITE_COUNTER: {
        updateInviteCounter();
        break;
      }
      default: {
        break;
      }
    }
  });

  port.onDisconnect.addListener(stopInviting);
};

const changeState = (action) => {
  const isStart = action === 'start';

  stopButton.classList[isStart ? 'remove' : 'add']('hidden');
  startButton.classList[isStart ? 'add' : 'remove']('hidden');

  if (isStart) {
    warningMessage.classList.add('hidden');
  }
};

const startInviting = () =>
  chrome.tabs.create({ url: SEARCH_URL, active: false }, ({ id }) => {
    changeState('start');
    setCurrentTabId(id);
    window.setTimeout(() => setPortConnection(id), 3000);
  });

const stopInviting = () =>
  getCurrentTabId().then((currentTabId) => remove(currentTabId, () => changeState('stop')));

const updateInviteCounter = () => getInvites().then(invites => totalInvitesNumber.innerHTML = invites.length);


fillSettings();
updateInviteCounter();
getCurrentTabId().then((currentTabId) => {
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
});

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
