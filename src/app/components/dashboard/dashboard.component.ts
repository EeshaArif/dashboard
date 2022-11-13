import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ChartSelectionChangedEvent, ChartType } from 'angular-google-charts';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import {
  CovidStatisticsResponse,
  geoChartCountries,
  geoChartCountryMap,
} from 'src/app/models/covid-data.model';
import { CovidDataService } from 'src/app/services/covid-data/covid-data.service';

//   THE TASK WILL ASSESS YOU ON:
// - UI & UX.
// - API calling & authentication.
// - Cashing and browser storage utilization.

// YOU ARE TO USE ANGULAR TO COMPLETE THIS TASK.
// - Angular 8 or above.

// TASK:
// You are to build a Dashboard showcasing the live progress of COVID-19 around the
// world.
// - Map to show the countries affected by Coronavirus with the ability to search or
// filter by country.
// - Use charts to display statistics for the spread of the coronavirus in affected
// countries.
// - Display historical monthly statistics based on country.

const POLL_INTERVAL = 900000;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private statsSubscription: Subscription | null = null;
  public renderChart: boolean = false;
  public statistic: CovidStatisticsResponse | undefined;
  private statistics: CovidStatisticsResponse[] = [];
  private geoMapStatistics: CovidStatisticsResponse[] = [];
  public geoChartType: ChartType = ChartType.GeoChart;
  public geoChartColumns = ['Country', 'Cases', 'Deaths'];
  public geoChartData: (string | number)[][] | null = null;
  public geoChartOptions = {
    colorAxis: { colors: ['blue', 'orange', 'red'] },
  };

  constructor(
    private covidDataService: CovidDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.handleFetchStats();
  }

  private handleFetchStats() {
    // fetch data every 15 minutes
    this.statsSubscription = interval(POLL_INTERVAL)
      .pipe(
        startWith(0),
        switchMap(() => this.covidDataService.getCovidStatistics())
      )
      .subscribe({
        next: (value) => {
          this.statistics = value;
          this.statistic = this.statistics.find(
            (stat) => stat.country === (this.statistic?.country ?? 'All')
          );
          this.geoMapStatistics = this.statistics
            .map((stat) => {
              const updatedCountry = this.getSupportedCountry(stat.country);
              return { ...stat, country: updatedCountry };
            })
            .filter((stat) => !!stat.country) as CovidStatisticsResponse[];

          this.updateGeoChartData();
        },
        error: (err) => {
          console.error('failed to fetch covid statistics', err);
        },
      });
  }

  private updateGeoChartData() {
    this.geoChartData = this.geoMapStatistics.map((stat) => [
      stat.country,
      stat.cases?.total ?? 0,
      stat.deaths?.total ?? 0,
    ]);
    this.renderChart = true;
    this.cdr.detectChanges();
  }

  public onSelect(value: ChartSelectionChangedEvent) {
    if (!value.selection[0]?.row) {
      console.warn('no country value selected, please click on the highlighted places of the map');
      return;
    }
    this.statistic = this.geoMapStatistics[value.selection[0].row];
    this.cdr.detectChanges();
  }

  private getSupportedCountry(country: string): string | null {
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

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }
}
