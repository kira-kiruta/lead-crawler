import asyncInterval from 'asyncinterval';
import {
  PORT_NAME_POPUP,
  PORT_NAME_BACKGROUND,
  ERROR_NOT_LOGGED_IN,
} from './../common/const';
import {
  isCurrentTab,
  checkLogin,
  getSettings,
  waitForIt,
  getPersons,
  sendInvitation,
  openNextPage,
  saveNewInvite,
  updateInviteCounter,
  closeCurrentSession,
} from './utils';

let port = null;
let popupPort = null;
let isError = false;
let currentInvitesNumber = 0;

const { connect, onConnect } = chrome.runtime;

const createPort = () => {
  port = connect({ name: PORT_NAME_BACKGROUND });
  port.onMessage.addListener((msg) => {});
};

const startInviting = ({ timeInterval, invitesLimit }) => {
  let iterator = 0;

  let persons = getPersons();
  console.log('PERSONS: ', persons);
  asyncInterval((next) => {
    if (currentInvitesNumber >= invitesLimit) {
      closeCurrentSession(port);
      return;
    }

    const person = persons[iterator];
    if (person) {
      sendInvitation(person).then(() => {
        saveNewInvite(port);
        if (popupPort) {
          updateInviteCounter(popupPort);
        }
        next();
      });
      iterator = iterator + 1;
      currentInvitesNumber = currentInvitesNumber + 1;
    } else {
      iterator = 0;
      openNextPage();
      waitForIt().then(() => {
        persons = getPersons();
        console.log('NEW PERSONS: ', persons);
        next();
      });
    }
  }, timeInterval * 1000);
};

const handleError = (error) => {
  console.log('Error: ', error);
  if (!error) {
    return;
  }

  switch(error.message) {
    case ERROR_NOT_LOGGED_IN: {
      isError = true;
      break;
    }
    default: {
      break;
    }
  }
};

isCurrentTab()
  .then(createPort)
  .then(checkLogin)
  .then(waitForIt)
  .then(getSettings)
  .then(startInviting)
  .catch(handleError);

onConnect.addListener((port) => {
  popupPort = port;
  port.onDisconnect.addListener(() => popupPort = null);

  if (port.name !== PORT_NAME_POPUP || isError) {
    port.disconnect();
  }
});


