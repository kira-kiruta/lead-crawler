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
} from './utils';

let port = null;
let popupPort = null;
let isError = false;
const { connect, onConnect } = chrome.runtime;

const createPort = () => {
  port = connect({ name: PORT_NAME_BACKGROUND });
  port.onMessage.addListener((msg) => {});
};

const startInviting = ({ timeInterval, invitesLimit }) => {
  let iterator = 0;
  const persons = getPersons();
  console.log('PERSONS: ', persons);
  const interval = window.setInterval(() => {
    const person = persons[iterator];
    if (person) {
      sendInvitation(person).then(() => {
        saveNewInvite(port);
        if (popupPort) {
          updateInviteCounter(popupPort);
        }
      });
      iterator = iterator + 1;
    } else {
      window.clearInterval(interval);
      openNextPage();
      window.setTimeout(() => location.reload(), 500);
    }
  }, timeInterval * 1000);
};

const handleError = ({ message }) => {
  console.log('Error: ', message);
  switch(message) {
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


