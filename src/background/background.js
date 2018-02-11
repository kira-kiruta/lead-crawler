import {
  MESSAGE_GET_SETTINGS,
  MESSAGE_SAVE_NEW_INVITE,
  MESSAGE_CHECK_IF_CURRENT_TAB,
} from './../common/const';
import { isCurrentTab } from './utils';
import { getSettings, saveInvite } from './../common/utils';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.message) {
    case MESSAGE_CHECK_IF_CURRENT_TAB: {
      isCurrentTab(sender.tab.id).then(isCurrentTab => sendResponse({ isCurrentTab }));
      break;
    }
    case MESSAGE_GET_SETTINGS: {
      getSettings().then(settings => sendResponse(settings));
      break;
    }
    case MESSAGE_SAVE_NEW_INVITE: {
      saveInvite();
      break;
    }
    default: {
      break
    }
  }

  return true;
});
