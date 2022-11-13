import {
  geoChartCountries,
  countryToGeoChartCountryMap,
} from '../models/geo-chart.model';

export function getSupportedCountry(country: string): string | null {
  if (country === 'All') {
    return country;
  }
  const supportedCountryFormat: string =
    country.indexOf('-') !== -1 ? country.split('-').join(' ') : country;

  if (geoChartCountries.includes(supportedCountryFormat)) {
    return supportedCountryFormat;
  }
  if (countryToGeoChartCountryMap.has(supportedCountryFormat)) {
    return countryToGeoChartCountryMap.get(supportedCountryFormat) as string;
  }
  return null;
}
