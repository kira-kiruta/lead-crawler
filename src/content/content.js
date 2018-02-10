import { MESSAGE_CHECK_IF_CURRENT_TAB } from './../common/const';
const { sendMessage } = chrome.runtime;

sendMessage({ message: MESSAGE_CHECK_IF_CURRENT_TAB }, (response) => {
  const { isCurrentTab } = response;

  console.log('CURRENT TAB: ', isCurrentTab);
});
