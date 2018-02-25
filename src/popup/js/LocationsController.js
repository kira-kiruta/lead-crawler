import Choices from 'choices.js';
import locations from './../../json/locations';


export default class LocationsController {
  constructor() {
    const choices = this.structurizeData(locations);
    const locationsField = document.getElementById('js-locations-field');

    this.selector = new Choices(locationsField, {
      choices,
      addItems: true,
      duplicateItems: false,
      removeItemButton: true,
      noResultsText: 'Not found',
      placeholder: true,
      placeholderValue: 'Select countries',
      // placeholderValue: 'Select countries',
      classNames: {
        containerOuter: 'Choices',
        containerInner: 'Choices__Inner',
        // listDropdown: 'Choices__List--Dropdown',
        listItems: 'Choices__List--Multiply',
        itemSelectable: 'Choices__Item--Selectable',
        input: 'Choices__Input',
        button: 'Choices__Button',
      },
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


