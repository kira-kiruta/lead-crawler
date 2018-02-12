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
      console.log('SEARCH CONTAINER: ', searchContainer);
      if (searchContainer) {
        // window.scrollBy({
        //   top: 9999999,
        //   // behavior: 'smooth'
        // });
        window.setTimeout(() => {
          const invisibleNodes = Array.from(document.querySelectorAll('.search-result__occlusion-hint'));
          invisibleNodes.forEach((node) => {
            console.log('NODE123: ', node);
            searchContainer.insertBefore(node, searchContainer.firstChild)
          });
          let nodeIterator = 0;
          const nodeInterval = window.setInterval(() => {
            const node = invisibleNodes[nodeIterator];
            if (node) {
              console.log('NODE: ', node);
              node.scrollIntoView({
                block: 'end',
                // behavior: 'smooth',
              });
              nodeIterator = nodeIterator + 1;
            } else {
              window.clearInterval(nodeInterval);
              window.setTimeout(() => resolve(), 1000);
            }
          }, 100);
          window.dispatchEvent(new Event('resize'));
          window.dispatchEvent(new Event('scroll'));
        }, 1500);
        window.clearInterval(interval);
      }
    }, 500);
  });


export const getPersons = () =>
  Array.from(document.querySelectorAll('.search-result--person'))
  .filter(person => person.querySelector('.search-result__actions--primary:not(:disabled)'));

// export const getNextPerson = (currentNumber) => {
//   const person = document.querySelector(`.search-result__occluded-item:eq(${ currentNumber })`);
//   while (person) {
//     if (person) {
//       person.
//     }
//   }
// };

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

export const openNextPage = () => {
  const nextPageTrigger = document.querySelector('.next-text');
  if (nextPageTrigger) {
    nextPageTrigger.click();
  }
};
