import { SEARCH_URL } from "../../common/const";

export const generateSearchURL = ({ locations, search, types }) => {
  const typesString = JSON.stringify(types);
  let url = SEARCH_URL + `&facetNetwork=${typesString}&keywords=${search}`;

  if (locations && locations.length) {
    url = url + '&facetGeoRegion=[';
    locations.forEach(({ value }, index) => {
      const isLastLocation = index < locations.length - 1;
      url = url + `"${value}:0"${isLastLocation ? ',' : ''}`;
    });
    url = url + ']';
  }

  return url;
};
