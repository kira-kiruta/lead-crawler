import {
  PORT_NAME_BACKGROUND,
  MESSAGE_GET_SETTINGS,
  MESSAGE_SAVE_NEW_INVITE,
  MESSAGE_CHECK_IF_CURRENT_TAB,
  MESSAGE_CLOSE_CURRENT_SESSION,
} from './../common/const';
import {
  getSettings,
  saveInvite,
  getCurrentTabId,
  closeCurrentSession,
} from './../common/utils';

const { onConnect, onMessage } = chrome.runtime;

onConnect.addListener((port) => {
  if (port.name !== PORT_NAME_BACKGROUND) {
    port.disconnect();
    return;
  }

  port.onMessage.addListener((request) => {
    switch(request.message) {
      case MESSAGE_SAVE_NEW_INVITE: {
        saveInvite();
        break;
      }
      case MESSAGE_CLOSE_CURRENT_SESSION: {
        closeCurrentSession();
        break;
      }
      default: {
        break
      }
    }
  });
});

onMessage.addListener((request, sender, sendResponse) => {
  switch(request.message) {
    case MESSAGE_CHECK_IF_CURRENT_TAB: {
      getCurrentTabId().then(currentTabId =>
        sendResponse({ isCurrentTab: currentTabId === sender.tab.id })
      );
      break;
    }
    case MESSAGE_GET_SETTINGS: {
      getSettings().then(settings => sendResponse(settings));
      break;
    }
    default: {
      break
    }
  }

  return true;
});
