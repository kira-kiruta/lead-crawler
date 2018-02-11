import { SEARCH_URL } from './../../common/const';
import { getInvites } from './../../common/utils';
import { fillFields } from './settings';

const { local } = chrome.storage;
const searchForm = document.getElementById('js-search-form');
const totalInvitesNumber = document.getElementById('js-invites-number');

fillFields();
getInvites().then(invites => totalInvitesNumber.innerHTML = invites.length);

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  chrome.tabs.create({ url: SEARCH_URL, active: false }, tab => local.set({ currentTabId: tab.id }));
});
