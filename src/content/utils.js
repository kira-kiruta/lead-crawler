import {
  ERROR_NOT_LOGGED_IN,
  MESSAGE_NOT_LOGGED_IN,
  MESSAGE_LOGGED_IN,
  MESSAGE_GET_SETTINGS,
  MESSAGE_SAVE_NEW_INVITE,
  MESSAGE_CHECK_IF_CURRENT_TAB,
  MESSAGE_UPDATE_INVITE_COUNTER,
  MESSAGE_CLOSE_CURRENT_SESSION,
  MESSAGE_SEND_FOUND_CONTACTS_AMOUNT,
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

export const getPersons = ({ search }) =>
  Array.from(document.querySelectorAll('.search-result--person'))
  .filter(person => {
    // const isAlreadyInvited = Boolean(person.querySelector('.search-result__actions--primary:not(:disabled)'));

    // if (isAlreadyInvited) {
    //   return false;
    // }
    //
    // if (location) {
    //   const locationElement = document.querySelector('.search-result__info .subline-level-2');
    //   const personLocation = locationElement ? locationElement.innerText.trim().toLowerCase() : '';
    //
    //   if (!personLocation) {
    //     return false;
    //   }
    //
    //   const possibleLocations = location.split(',');
    //   const locationIndex = possibleLocations.findIndex(possibleLocation =>
    //     possibleLocation.trim().toLowerCase().search(personLocation) > -1
    //   );
    //
    //   if (locationIndex === -1) {
    //     return false;
    //   }
    // }
    //
    // if (title) {
    //
    // }
    return person.querySelector('.search-result__actions--primary:not(:disabled)');
  });

export const sendInvitation = ({ person, note }) =>
  new Promise((resolve) => {
    const trigger = person.querySelector('.search-result__actions--primary');
    if (trigger) {
      trigger.click();
      window.setTimeout(() => {
        if (note) {
          const noteButton = document.querySelector('.send-invite__actions .button-secondary-large');
          noteButton.click();
          window.setTimeout(() => {
            const noteArea = document.querySelector('.send-invite__custom-message');
            const confirmButton = document.querySelector('.send-invite__actions .button-primary-large');
            noteArea.value = note;
            confirmButton.click();
            resolve();
          }, 50);

        } else {
          const confirmButton = document.querySelector('.send-invite__actions .button-primary-large');
          if (confirmButton) {
            confirmButton.click();
          }
          resolve();
        }
      }, 500);
    }
  });

export const saveNewInvite = (port) => {
  if (!port) {
    return;
  }

  port.postMessage({ message: MESSAGE_SAVE_NEW_INVITE });
};

export const updateInviteCounter = (port) => {
  if (!port) {
    return;
  }

  port.postMessage({ message: MESSAGE_UPDATE_INVITE_COUNTER });
};

export const closeCurrentSession = (port) => {
  if (!port) {
    return;
  }

  port.postMessage({ message: MESSAGE_CLOSE_CURRENT_SESSION });
};

export const sendFoundContactsAmount = (port) => {
  console.log('PORT: ', port);
  if (!port) {
    return;
  }

  const amount = document.querySelector('.search-results__total').innerText.replace(/[^0-9,]*/g, '');
  port.postMessage({ message: MESSAGE_SEND_FOUND_CONTACTS_AMOUNT, data: { amount } });
};

export const openNextPage = () => {
  const nextPageTrigger = document.querySelector('.next-text');
  if (nextPageTrigger) {
    nextPageTrigger.click();
  }
};
