import {
  isCurrentTab,
  getSettings,
  waitForIt,
  getPersons,
  sendInvitation,
  openNextPage,
  saveNewInvite,
} from './utils';

isCurrentTab().then(waitForIt).then(getSettings).then(({ timeInterval, invitesLimit }) => {
  let iterator = 0;
  const persons = getPersons();
  const interval = window.setInterval(() => {
  // Save invite info
    const person = persons[iterator];
    if (person) {
      sendInvitation(person).then(saveNewInvite);
      iterator = iterator + 1;
    } else {
      window.clearInterval(interval);
      openNextPage();
    }
  }, timeInterval)
});
