export type CovidStatisticsResponse = {
  continent: string | null;
  country: string;
  day: string; //"2020-06-02"
  population: number | null;
  time: string; //"2020-06-02T20:45:06+00:00"
  cases: CovidStatisticsResponseCase;
  deaths: CovidStatisticsResponseDeath;
  tests: CovidStatisticsResponseTest;
};

export type CovidStatisticsResponseCase = {
  '1M_pop': string | null;
  active: number;
  critical: number | null;
  new: string | null; //"+5",
  recovered: number;
  total: number;
};

export type CovidStatisticsResponseDeath = {
  '1M_pop': string | null;
  new: string | null; //"+5",
  total: number;
};

export type CovidStatisticsResponseTest = {
  '1M_pop': string | null;
  total: number | null;
};

export const geoChartCountryMap = new Map([
  ['South Sudan', 'SD'],
  ['Saint Martin', 'MF'],
  ['Timor Leste', 'TL'],
  ['Caribbean Netherlands', 'AN'],
  ['Guinea Bissau', 'GW'],
  ['St Vincent Grenadines', 'VC'],
  ['Turks and Caicos', 'TC'],
  ['St Barth', 'BL'],
  ['Saint Pierre Miquelon', 'PM'],
  ['Vatican City', 'VA'],
  ['Cabo Verde', 'CV'],
  ['North Macedonia', 'MK'],
  ['UAE', 'AE'],
  ['S Korea', 'KR'],
  ['US Virgin Islands', 'VI'],
  ['Congo', 'CG'],
  ['DRC', 'CD'],
  ['Palestine', 'PS'],
  ['USA', 'US'],
  ['CAR', 'CF'],
  ['DPRK', 'KP'],
  ['Eswatini', 'SZ'],
  ['Sint Maarten', 'SX'],
  ['Channel Islands', 'GB'],
  ['R&eacute;union', 'RE'],
  ['Cura&ccedil;ao', 'CW'],
  ['Czechia', 'CZ'],
  ['MS Zaandam', 'MS'],
  ['Faeroe Islands', 'FO'],
]);
//   'Asia',
//   'North America',
//   'Africa',
//   'Europe',
//   'All',
//   'Diamond Princes ',
export const geoChartCountries = [
  'Lesotho',
  'Saint Lucia',
  'Micronesia',
  'Burkina Faso',
  'Solomon Islands',
  'Bermuda',
  'Tonga',
  'Dominica',
  'Djibouti',
  'Marshall Islands',
  'Gibraltar',
  'Gambia',
  'Cayman Islands',
  'Grenada',
  'Greenland',
  'Vanuatu',
  'Aruba',
  'Antigua and Barbuda',
  'Chad',
  'British Virgin Islands',
  'Saint Kitts and Nevis',
  'Equatorial Guinea',
  'Cook Islands',
  'Sierra Leone',
  'Nauru',
  'Kiribati',
  'Falkland Islands',
  'Saint Helena',
  'Montserrat',
  'Macao',
  'Sao Tome and Principe',
  'Wallis and Futuna',
  'Niue',
  'Comoros',
  'Liberia',
  'Palau',
  'Anguilla',
  'Western Sahara',
  'Tuvalu',
  'Burundi',
  'Brunei',
  'Martinique',
  'Guadeloupe',
  'Suriname',
  'Ivory Coast',
  'French Guiana',
  'Malawi',
  'French Polynesia',
  'Rwanda',
  'Belize',
  'South America',
  'Oceania',
  'UK',
  'Guam',

  /******* */
  'Isle of Man',
  'Eritrea',
  'Mali',
  'Togo',
  'Monaco',
  'Mayotte',
  'Bhutan',
  'Democratic Republic of the Congo',
  'Liechtenstein',
  'Maldives',
  'Sudan',
  'Zimbabwe',
  'Mauritania',
  'Mozambique',
  'Nigeria',
  'Swaziland',
  'Tanzania',
  'Iraq',
  'Guyana',
  'Namibia',
  'Senegal',
  'Turkmenistan',
  'Afghanistan',
  'Andorra',
  'Fiji',
  'Gabon',
  'Uzbekistan',
  'Cameroon',
  'Cuba',
  'Faroe Islands',
  'El Salvador',
  'Caribbean',
  'Ethiopia',
  'Mongolia',
  'Puerto Rico',
  'Samoa',
  'Myanmar',
  'Nicaragua',
  'Seychelles',
  'Tajikistan',
  'Dominican Republic',
  'Guinea',
  'Barbados',
  'CI',
  'Laos',
  'Libya',
  'Panama',
  'Bahrain',
  'Benin',
  'Ghana',
  'Haiti',
  'Montenegro',
  'Somalia',
  'Syria',
  'Ecuador',
  'Honduras',
  'Madagascar',
  'Papua New Guinea',
  'Tunisia',
  'Angola',
  'Botswana',
  'Cyprus',
  'Algeria',
  'Bahamas',
  'New Caledonia',
  'Uganda',
  'Yemen',
  'Zambia',
  'Antarctica',
  'Paraguay',
  'Jamaica',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Vietnam',
  'Kenya',
  'Luxembourg',
  'Niger',
  'Kuwait',
  'Hawaii',
  'Scotland',
  'Cambodia',
  'Uruguay',
  'Kyrgyzstan',
  'Saudi Arabia',
  'Indonesia',
  'Azerbaijan',
  'United Arab Emirates',
  'Mauritius',
  'Morocco',
  'Albania',
  'South Korea',
  'Kazakhstan',
  'Macedonia',
  'Venezuela',
  'Taiwan',
  'Qatar',
  'Jordan',
  'Iceland',
  'Guatemala',
  'Costa Rica',
  'Hong Kong',
  'San Marino',
  'Colombia',
  'Moldova',
  'Armenia',
  'Malta',
  'Nepal',
  'Lebanon',
  'Malaysia',
  'Serbia',
  'Peru',
  'Trinidad and Tobago',
  'Lithuania',
  'Estonia',
  'Georgia',
  'Iran',
  'Chile',
  'Latvia',
  'Thailand',
  'Egypt',
  'Slovenia',
  'Mexico',
  'Belarus',
  'Slovakia',
  'Sri Lanka',
  'Croatia',
  'Philippines',
  'Bangladesh',
  'Turkey',
  'Romania',
  'Italy',
  'South Africa',
  'Hungary',
  'Pakistan',
  'Portugal',
  'Ukraine',
  'Greece',
  'Oman',
  'Argentina',
  'Singapore',
  'Bulgaria',
  'Japan',
  'Czech Republic',
  'Ireland',
  'China',
  'Finland',
  'Brazil',
  'Norway',
  'Austria',
  'Denmark',
  'Belgium',
  'New Zealand',
  'Spain',
  'Switzerland',
  'Russia',
  'Poland',
  'Israel',
  'Sweden',
  'Netherlands',
  'France',
  'Australia',
  'Canada',
  'India',
  'Germany',
  'United Kingdom',
  'United States',
  'Unknown',
];
