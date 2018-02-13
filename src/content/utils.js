import {
  ERROR_NOT_LOGGED_IN,
  MESSAGE_NOT_LOGGED_IN,
  MESSAGE_LOGGED_IN,
  MESSAGE_GET_SETTINGS,
  MESSAGE_SAVE_NEW_INVITE,
  MESSAGE_CHECK_IF_CURRENT_TAB,
  MESSAGE_UPDATE_INVITE_COUNTER,
  MESSAGE_CLOSE_CURRENT_SESSION,
} from './../common/const';

const { sendMessage } = chrome.runtime;

export const isCurrentTab = () =>
  new Promise((resolve, reject) =>
    sendMessage({ message: MESSAGE_CHECK_IF_CURRENT_TAB }, ({ isCurrentTab }) => {
      if (isCurrentTab) {
        resolve();
      } else {
        reject();
      }
    })
  );

export const checkLogin = () =>
  new Promise((resolve) => {
    const isLoginPage = location.href.search('/login/') > -1;
    if (isLoginPage) {
      sendMessage({ message: MESSAGE_NOT_LOGGED_IN });
      throw new Error(ERROR_NOT_LOGGED_IN);
    } else {
      sendMessage({ message: MESSAGE_LOGGED_IN });
      resolve();
    }
  });

export const getSettings = () =>
  new Promise(resolve =>
    sendMessage({ message: MESSAGE_GET_SETTINGS }, (settings) => resolve(settings))
  );

export const waitForIt = () =>
  new Promise(resolve => {
    window.setTimeout(() => {
      const interval = window.setInterval(() => {
        const loader = document.querySelector('.search-is-loading');
        const searchContainer = document.querySelector('.results-list');
        console.log('SEARCH CONTAINER: ', searchContainer);
        if (searchContainer && !loader) {
          window.scrollTo(0, 0);
          window.setTimeout(() => {
            window.scrollBy({
              top: 9999999,
              behavior: 'smooth'
            });
            window.clearInterval(interval);
            window.setTimeout(() => resolve(), 1000);
          }, 100);
        }
      }, 500);
    }, 200);
  });

export const getPersons = () =>
  Array.from(document.querySelectorAll('.search-result--person'))
  .filter(person => person.querySelector('.search-result__actions--primary:not(:disabled)'));

export const sendInvitation = person =>
  new Promise((resolve) => {
    const trigger = person.querySelector('.search-result__actions--primary');
    if (trigger) {
      trigger.click();
      window.setTimeout(() => {
        const confirmButton = document.querySelector('.send-invite__actions .button-primary-large');
        if (confirmButton) {
          confirmButton.click();
        }
        resolve();
      }, 500);
    }
  });

export const saveNewInvite = (port) =>
  port.postMessage({ message: MESSAGE_SAVE_NEW_INVITE });

export const updateInviteCounter = (port) =>
  port.postMessage({ message: MESSAGE_UPDATE_INVITE_COUNTER });

export const closeCurrentSession = (port) =>
  port.postMessage({ message: MESSAGE_CLOSE_CURRENT_SESSION });

export const openNextPage = () => {
  const nextPageTrigger = document.querySelector('.next-text');
  if (nextPageTrigger) {
    nextPageTrigger.click();
  }
};
