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
  sendFoundContactsAmount,
} from './utils';
import {MESSAGE_REQUEST_FOUND_CONTACTS_AMOUNT} from "../common/const";

let port = null;
let popupPort = null;
let isError = false;
let currentInvitesNumber = 0;

const { connect, onConnect } = chrome.runtime;

const createPort = () => {
  port = connect({ name: PORT_NAME_BACKGROUND });
  port.onMessage.addListener((msg) => {});
};

const startInviting = ({ timeInterval, invitesLimit, location, search, note }) => {
  let iterator = 0;

  let persons = getPersons({ search });
  asyncInterval((next) => {
    if (currentInvitesNumber >= invitesLimit) {
      closeCurrentSession(port);
      return;
    }

    const person = persons[iterator];
    if (person) {
      sendInvitation({ person, note }).then(() => {
        saveNewInvite(port);
        updateInviteCounter(popupPort);
        next();
      });
      iterator = iterator + 1;
      currentInvitesNumber = currentInvitesNumber + 1;
    } else {
      iterator = 0;
      openNextPage();
      waitForIt().then(() => {
        persons = getPersons({ location, search });
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
  .then(() => sendFoundContactsAmount(popupPort))
  .then(getSettings)
  .then(startInviting)
  .catch(handleError);

onConnect.addListener((port) => {
  if (port.name !== PORT_NAME_POPUP || isError) {
    port.disconnect();
    return;
  }

  popupPort = port;

  port.onMessage.addListener((request) => {
    const { message } = request;

    switch (message) {
      case MESSAGE_REQUEST_FOUND_CONTACTS_AMOUNT: {
        sendFoundContactsAmount(popupPort);
        break;
      }
      default: {
        break;
      }
    }
  });

  port.onDisconnect.addListener(() => popupPort = null);
});
