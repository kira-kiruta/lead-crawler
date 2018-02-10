import { isCurrentTab, waitForIt, getPersons, sendInvitation, openNextPage } from './utils';

isCurrentTab().then(waitForIt).then(() => {
  let iterator = 0;
  const persons = getPersons();
  const interval = window.setInterval(() => {
    const person = persons[iterator];
    if (person) {
      sendInvitation(person);
      iterator = iterator + 1;
    } else {
      window.clearInterval(interval);
      openNextPage();
    }
  }, 5000)
});
