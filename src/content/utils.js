import {
  ERROR_NOT_LOGGED_IN,
  MESSAGE_NOT_LOGGED_IN,
  MESSAGE_LOGGED_IN,
  MESSAGE_GET_SETTINGS,
  MESSAGE_SAVE_NEW_INVITE,
  MESSAGE_CHECK_IF_CURRENT_TAB,
  MESSAGE_UPDATE_INVITE_COUNTER,
} from './../common/const';
import {MESSAGE_NOT_LOGGED_IN, MESSAGE_SAVE_NEW_INVITE} from "../common/const";

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
    const interval = window.setInterval(() => {
      const searchContainer = document.querySelector('.results-list');
      if (searchContainer) {
        window.scrollTo(0, document.body.scrollHeight);
        window.setTimeout(() => window.scrollTo(0, 0), 500);
        // window.scrollBy({
        //   top: 999999,
        //   behavior: 'smooth'
        // });
        window.setTimeout(() => resolve(), 2000);
        window.clearInterval(interval);
      }
    }, 500);
  });


export const getPersons = () => Array.from(document.querySelectorAll('.search-result--person'))
  .filter(person => person.querySelector('.search-result__actions--primary:not(:disabled)'));

export const sendInvitation = person =>
  new Promise((resolve, reject) => {
    const trigger = person.querySelector('.search-result__actions--primary');
    if (trigger) {
      trigger.click();
      window.setTimeout(() => {
        const confirmButton = document.querySelector('.send-invite__actions .button-primary-large');
        if (confirmButton) {
          confirmButton.click();
          resolve();
        } else {
          reject();
        }
      }, 500);
    }
  });

export const saveNewInvite = (port) =>
  port.postMessage({ message: MESSAGE_SAVE_NEW_INVITE });

export const updateInviteCounter = (port) =>
  port.postMessage({ message: MESSAGE_UPDATE_INVITE_COUNTER });

export const openNextPage = () => {
  const nextPageTrigger = document.querySelector('.next-text');
  if (nextPageTrigger) {
    nextPageTrigger.click();
  }
};
