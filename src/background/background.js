import { MESSAGE_CHECK_IF_CURRENT_TAB } from './../common/const';
import { isCurrentTab } from './utils';

const { addListener } = chrome.runtime.onMessage;

addListener((request, sender, sendResponse) => {
  switch(request.message) {
    case MESSAGE_CHECK_IF_CURRENT_TAB: {
      sendResponse({ isCurrentTab: isCurrentTab() });
    }
  }

  return true;
});
