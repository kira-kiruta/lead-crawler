import { SEARCH_URL } from './config';

const { local } = chrome.storage;
const searchForm = document.getElementById('js-search-form');


searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  chrome.tabs.create({ url: SEARCH_URL }, tab => local.set({ currentTabId: tab.id }));
});
