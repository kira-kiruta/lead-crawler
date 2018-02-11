import { getSettings } from './../../common/utils';

const intervalField = document.getElementById('js-invites-interval');
const invitesLimitField = document.getElementById('js-invites-limit');

export const fillFields = () =>
  getSettings().then(({ timeInterval, invitesLimit }) => {
    intervalField.value = timeInterval;
    invitesLimitField.value = invitesLimit;
  });
