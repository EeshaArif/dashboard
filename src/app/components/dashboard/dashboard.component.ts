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
import {
  CovidStatisticsResponse,
} from '../../models/covid-data.model';
import { CovidDataService } from '../../services/covid-data/covid-data.service';
import { getSupportedCountry } from '../../utils/geo-chart.utils';
import { SidebarStatsComponent } from '../sidebar-stats/sidebar-stats.component';

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
    colorAxis: { colors: ['blue', 'orange', 'red'] },
  };

  public isLoading: boolean = true;

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
          // select country previously selected
          const country = this.localStorageService.getItem('country');

          this.chosenStatistic = newStats.find(
            (stat) => stat.country === (country ?? this.chosenStatistic?.country ?? 'All')
          );
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

     // map required data to table format to display
    this.geoChartData = this.geoMapStatistics.map((stat) => [
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

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }
}
