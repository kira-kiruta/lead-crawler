import asyncInterval from 'asyncinterval';
import {
  PORT_NAME_POPUP,
  PORT_NAME_BACKGROUND,
  ERROR_NOT_LOGGED_IN,
  MESSAGE_REQUEST_FOUND_CONTACTS_AMOUNT,
} from './../common/const';
import {
  isCurrentTab,
  checkLogin,
  getSettings,
  waitForIt,
  getPersons,
  sendInvitation,
  saveNewInvite,
  updateInviteCounter,
  closeCurrentSession,
  sendFoundContactsAmount,
} from './utils';

let port = null;
let popupPort = null;
let isError = false;
let settings = {};
let iterator = 0;
let currentSessionInvites = 0;

const { connect, onConnect } = chrome.runtime;

const createPort = () => {
  port = connect({ name: PORT_NAME_BACKGROUND });
  port.onMessage.addListener((msg) => {});
};

const handleSingleInvitation = (person, note) =>
  new Promise((resolve) => {
    if (!person) {
      resolve();
      return;
    }

    sendInvitation({ person }).then(() => {
      saveNewInvite(port);
      iterator = iterator + 1;
      currentSessionInvites = currentSessionInvites + 1;
      updateInviteCounter(popupPort, currentSessionInvites);
      resolve();
    });
  });

const startInviting = (persons) => {
  const { timeInterval, invitesLimit, note } = settings;
  let person = persons[iterator];

  handleSingleInvitation(person).then(() => {
    const interval = asyncInterval((next) => {
      if (currentSessionInvites >= invitesLimit) {
        interval.clear();
        closeCurrentSession(port);
        return;
      }

      let person = persons[iterator];

      if (person) {
        handleSingleInvitation(person).then(next);
      } else {
        iterator = 0;
        getPersons(true).then(response => {
          persons = response;
          person = persons[iterator];
          handleSingleInvitation(person).then(next);
        });
      }
    }, timeInterval * 1000);
  });
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
  .then(() => getSettings().then((response) => settings = response))
  .then(getPersons)
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
