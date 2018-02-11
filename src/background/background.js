import {
  PORT_NAME_BACKGROUND,
  MESSAGE_GET_SETTINGS,
  MESSAGE_SAVE_NEW_INVITE,
  MESSAGE_CHECK_IF_CURRENT_TAB,
} from './../common/const';
import { isCurrentTab } from './utils';
import { getSettings, saveInvite } from './../common/utils';

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
      default: {
        break
      }
    }
  });
});

onMessage.addListener((request, sender, sendResponse) => {
  switch(request.message) {
    case MESSAGE_CHECK_IF_CURRENT_TAB: {
      isCurrentTab(sender.tab.id).then(isCurrentTab => sendResponse({ isCurrentTab }));
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
