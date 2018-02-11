import {
  MESSAGE_GET_SETTINGS,
  MESSAGE_CHECK_IF_CURRENT_TAB,
  MESSAGE_GET_CURRENT_INVITES_NUMBER,
} from './../common/const';
import { isCurrentTab, getCurrentInvitesNumber } from './utils';
import { getSettings } from './../common/utils';

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
    case MESSAGE_GET_CURRENT_INVITES_NUMBER: {
      getCurrentInvitesNumber().then(invitesNumber => sendResponse(invitesNumber));
      break;
    }
    default: {
      break
    }
  }

  return true;
});
