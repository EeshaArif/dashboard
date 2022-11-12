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
  private statistics: CovidStatisticsResponse[] = [];
  private geoMapStatistics: CovidStatisticsResponse[] = [];
  public geoChartType: ChartType = ChartType.GeoChart;
  public geoChartColumns = ['Country', 'Cases', 'Deaths'];
  public geoChartData: (string | number)[][] = [];
  public geoChartOptions = {
    colorAxis: { colors: ['blue', 'orange', 'red'] },
  };

  constructor(
    private covidDataService: CovidDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // fetch data every 15 minutes
    this.statsSubscription = interval(POLL_INTERVAL)
      .pipe(
        startWith(0),
        switchMap(() => this.covidDataService.getCovidStatistics())
      )
      .subscribe({
        next: (value) => {
          this.statistics = value;
          this.geoMapStatistics = this.statistics
            .map((stat) => {
              const updatedCountry = this.getSupportedCountry(stat.country);
              return { ...stat, country: updatedCountry };
            })
            .filter((stat) => !!stat.country) as CovidStatisticsResponse[];

          this.updateChartData();
        },
        error: (err) => {
          console.error('failed to fetch covid statistics', err);
        },
      });
  }

  private getSupportedCountry(country: string): string | null {
    let supportedCountryFormat: string =
      country.indexOf('-') !== -1 ? country.split('-').join(' ') : country;

    if (geoChartCountries.includes(supportedCountryFormat)) {
      return supportedCountryFormat;
    }
    if (geoChartCountryMap.has(supportedCountryFormat)) {
      return geoChartCountryMap.get(supportedCountryFormat) as string;
    }
    return null;
  }

  private updateChartData() {
    this.geoChartData = this.geoMapStatistics.map((stat) => [
      stat.country,
      stat.cases?.total ?? 0,
      stat.deaths?.total ?? 0,
    ]);
    this.renderChart = true;
    this.cdr.detectChanges();
  }

  public onSelect(value: ChartSelectionChangedEvent) {
    console.error('selected', value);
    // value.selection[
    //   {column: null, row: 5}
    // ]
  }

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }
}
