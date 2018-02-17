import {
  getSettings,
  getDefaultSettings,
} from './../../common/utils';
import LocationsController from './LocationsController';

const { local } = chrome.storage;

export default class SettingsController {
  constructor() {
    this.locationsController = new LocationsController();

    this.noteField =  document.getElementById('js-note-field');
    this.searchField = document.getElementById('js-search-field');
    this.intervalField = document.getElementById('js-invites-interval-field');
    this.invitesLimitField = document.getElementById('js-invites-limit-field');

    this.settings = getDefaultSettings();
    getSettings().then((settings) => {
      this.settings = settings;
      this.fillSettingFields();
    });

    document.getElementById('js-save-settings').addEventListener('click', this.saveSettings);
    document.getElementById('js-reset-settings').addEventListener('click', this.resetSettings);
  }

  getSettings() {
    this.settings.locations = this.locationsController.getLocations();
    return this.settings;
  }

  fillSettingFields() {
    const { timeInterval, invitesLimit, locations, search, note } = this.settings;

    this.noteField.value = note;
    this.searchField.value = search;
    this.intervalField.value = timeInterval;
    this.invitesLimitField.value = invitesLimit;
    this.locationsController.setLocations(locations);
  }

  saveSettings() {
    return new Promise((resolve) => {
      this.settings = {
        types: this.getTypes(),
        note: this.noteField.value,
        search: this.searchField.value,
        timeInterval: this.intervalField.value,
        invitesLimit: this.invitesLimitField.value,
        locations: this.locationsController.getLocations(),
      };
      local.set({ settings: this.settings }, resolve);
    });
  }

  getTypes() {
    return Array
      .from(document.querySelectorAll('.js-type-checkbox:checked'))
      .map(typeCheckbox => typeCheckbox.dataset.type);
  }

  resetSettings() {
    return new Promise((resolve) => {
      const defaultSettings = getDefaultSettings();
      this.settings = defaultSettings;
      this.fillSettingFields();
      local.set({ settings: defaultSettings }, resolve);
    });
  }
}
