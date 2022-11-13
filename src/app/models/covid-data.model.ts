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
