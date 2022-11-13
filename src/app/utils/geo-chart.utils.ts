import {
  geoChartCountries,
  geoChartCountryMap,
} from '../models/covid-data.model';

export function getSupportedCountry(country: string): string | null {
  const supportedCountryFormat: string =
    country.indexOf('-') !== -1 ? country.split('-').join(' ') : country;

  if (geoChartCountries.includes(supportedCountryFormat)) {
    return supportedCountryFormat;
  }
  if (geoChartCountryMap.has(supportedCountryFormat)) {
    return geoChartCountryMap.get(supportedCountryFormat) as string;
  }
  return null;
}
