import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChartSelectionChangedEvent, ChartType } from 'angular-google-charts';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { POLL_INTERVAL } from 'src/app/app.module';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { CovidStatisticsResponse } from '../../models/covid-data.model';
import { CovidDataService } from '../../services/covid-data/covid-data.service';
import { getSupportedCountry } from '../../utils/geo-chart.utils';
import { SidebarStatsComponent } from '../sidebar-stats/sidebar-stats.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private statsSubscription: Subscription | null = null;
  public renderChart: boolean = false;
  public chosenStatistic: CovidStatisticsResponse | undefined;
  private geoMapStatistics: CovidStatisticsResponse[] = [];
  public geoChartType: ChartType = ChartType.GeoChart;
  public geoChartColumns = ['Country', 'Cases', 'Deaths'];
  public geoChartData: (string | number)[][] | null = null;
  public geoChartOptions = {
    colorAxis: { colors: ['blue', 'orange', '#ea1c23'] },
    backgroundColor: '#959595',
  };

  public isLoading: boolean = true;
  public countries: string[] = [];

  @ViewChild('sidebarStats')
  sidebarStatsRef?: SidebarStatsComponent;

  constructor(
    private covidDataService: CovidDataService,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.handleFetchStats();
  }

  private handleFetchStats() {
    // fetch data every 15 minutes (polling)
    this.statsSubscription = interval(POLL_INTERVAL)
      .pipe(
        startWith(0),
        switchMap(() => this.covidDataService.getCovidStatistics())
      )
      .subscribe({
        next: (newStats) => {
          this.handleNewStats(newStats);
          this.updateGeoChartData(newStats);
        },
        error: (err) => {
          console.error('failed to fetch covid statistics', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private updateGeoChartData(newStats: CovidStatisticsResponse[]) {
    // update geoMap with supported format
    this.geoMapStatistics = newStats
      .map((stat) => {
        const updatedCountry = getSupportedCountry(stat.country);
        return { ...stat, country: updatedCountry };
      })
      .filter((stat) => !!stat.country) as CovidStatisticsResponse[];

    // select country previously selected
    const country = this.localStorageService.getItem('country');

    this.chosenStatistic = this.geoMapStatistics.find(
      (stat) =>
        stat.country === (country ?? this.chosenStatistic?.country ?? 'All')
    );
    if (!this.chosenStatistic) {
      this.chosenStatistic = this.geoMapStatistics.find(
        (stat) => stat.country === 'All'
      );
    }
    if (!this.countries || this.countries.length <= 0) {
      this.countries = this.geoMapStatistics.map((stat) => stat.country);
    }

    // map required data to table format to display
    this.geoChartData = this.geoMapStatistics
      .filter((stats) => stats.country !== 'All')
      .map((stat) => [
        stat.country,
        stat.cases?.total ?? 0,
        stat.deaths?.total ?? 0,
      ]);

    this.renderChart = true;
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  private handleNewStats(newStats: CovidStatisticsResponse[]) {
    if (!this.sidebarStatsRef) {
      console.warn('failed to update new stats, sidebar ref does not exist');
      return;
    }
    this.sidebarStatsRef!.handleNewStats(newStats);
  }

  public onSelectCountry(value: ChartSelectionChangedEvent) {
    if (!value.selection[0]?.row) {
      console.warn(
        'no country value selected, please click on the highlighted places of the map'
      );
      return;
    }
    this.chosenStatistic = this.geoMapStatistics[value.selection[0].row];
    this.localStorageService.setItem('country', this.chosenStatistic.country);
    this.cdr.detectChanges();
  }

  public onCountryChanged(country: string) {
    const newStat = this.geoMapStatistics.find(
      (stat) => stat.country === country
    );
    if (!newStat) {
      console.error('failed to choose country, it is not supported');
      return;
    }
    this.chosenStatistic = newStat;
    this.localStorageService.setItem('country', this.chosenStatistic.country);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }
}
