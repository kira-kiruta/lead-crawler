import { MESSAGE_CHECK_IF_CURRENT_TAB } from './../common/const';
import { isCurrentTab } from './utils';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.message) {
    case MESSAGE_CHECK_IF_CURRENT_TAB: {
      isCurrentTab(sender.tab.id)
        .then(isCurrentTab => sendResponse({ isCurrentTab }));
    }
  }

  return true;
});
