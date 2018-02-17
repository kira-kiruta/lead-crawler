import Choices from 'choices.js';
import locations from './../../json/locations';


export default class LocationsController {
  constructor() {
    const choices = this.structurizeData(locations);
    const locationsField = document.getElementById('js-locations-field');

    this.selector = new Choices(locationsField, {
      choices,
      searchResultLimit: 10,
      addItems: true,
      duplicateItems: false,
      removeItemButton: true,
      noResultsText: 'Not found',
      placeholderValue: 'Select countries',
    });
  }

  getLocations() {
    return this.selector.getValue();
  }

  setLocations(locations) {
    this.selector.setValue(locations);
  }

  structurizeData(locations) {
    return locations.map(({ name, code }) =>
      ({
        value: code,
        label: name,
        selected: false,
      })
    );
  }
}


