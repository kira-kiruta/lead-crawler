import { SEARCH_URL } from './../../common/const';
import { fillFields } from './settings';

const { local } = chrome.storage;
const searchForm = document.getElementById('js-search-form');

fillFields();

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  chrome.tabs.create({ url: SEARCH_URL, active: false }, tab => local.set({ currentTabId: tab.id }));
});
