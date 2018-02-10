import { MESSAGE_CHECK_IF_CURRENT_TAB } from "./../common/const";

const { sendMessage } = chrome.runtime;

export const isCurrentTab = () => {
  return new Promise((resolve, reject) => {
    sendMessage({ message: MESSAGE_CHECK_IF_CURRENT_TAB }, (response) => {
      const { isCurrentTab } = response;
      if (isCurrentTab) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

export const waitForIt = () => {
  return new Promise((resolve, reject) => {
    const interval = window.setInterval(() => {
      const searchContainer = document.querySelector('.results-list');
      if (searchContainer) {
        window.scrollBy({
          top: 999999,
          behavior: 'smooth'
        });
        window.setTimeout(() => resolve(), 2000);
        window.clearInterval(interval);
      }
    }, 500);
  });
};

export const getPersons = () => Array.from(document.querySelectorAll('.search-result--person'))
  .filter(person => person.querySelector('.search-result__actions--primary:not(:disabled)'));

export const sendInvitation = (person) => {
  return new Promise((resolve, reject) => {
    console.log('PERSON: ', person);
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
};

export const openNextPage = () => {
  const nextPageTrigger = document.querySelector('.next-text');
  if (nextPageTrigger) {
    nextPageTrigger.click();
  }
};
