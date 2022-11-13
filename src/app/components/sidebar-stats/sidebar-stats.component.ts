import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { parseDateToLocaleDateString } from 'src/app/utils/date.utils';
import { CovidStatisticsResponse } from '../../models/covid-data.model';
import { CovidDataService } from '../../services/covid-data/covid-data.service';
import { normalizeObject } from '../../utils/normalize.utils';
// import { NgHttpCachingService } from 'ng-http-caching';

type Stats = {
  deaths: number;
  cases: number;
  tests: number;
  recovered: number;
  active: number;
  critical: number;
  newCases: number;
  newDeaths: number;
};

const defaultStats: Stats = {
  deaths: 0,
  cases: 0,
  tests: 0,
  recovered: 0,
  active: 0,
  critical: 0,
  newCases: 0,
  newDeaths: 0,
};

@Component({
  selector: 'app-sidebar-stats',
  templateUrl: './sidebar-stats.component.html',
  styleUrls: ['./sidebar-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarStatsComponent implements OnInit {
  @Input()
  set statistic(stat: CovidStatisticsResponse | undefined) {
    if (stat) {
      this._statistic = stat;
      this.country = stat.country;
      this.handleStatCharts();
      this.handleFetchHistory(stat.country);
    }
  }

  private _statistic?: CovidStatisticsResponse;
  public country: string = 'All'
  public historyMap: Map<string, CovidStatisticsResponse[]> = new Map();
  public history: CovidStatisticsResponse[] = [];
  private normalizedStats: Stats = {
    ...defaultStats,
  };
  public unnormalizedStats: Stats = {
    ...defaultStats,
  };

  public pieChartValues: number[] = [];
  public pieChartDisplayValues: number[] = [];
  public pieChartLabels: string[] = [];

  public ringChartValues: number[] = [];
  public ringChartDisplayValues: number[] = [];
  public ringChartLabels: string[] = [];
  public ringChartIndex = NaN;

  constructor(
    private cdr: ChangeDetectorRef,
    //  private ngHttpCachingService: NgHttpCachingService,
    private covidDataService: CovidDataService
  ) {}

  ngOnInit(): void {}

  private handleHistoryCharts() {
    this.history = this.historyMap.get(this.country)!;
    this.cdr.detectChanges();
  }

  private handleStatCharts() {
    this.normalizeData();
    this.createPieChart();
    this.createRingChart();
    this.cdr.detectChanges();
  }

  private createPieChart(): void {
    this.pieChartLabels = ['Active', 'Recovered', 'Deaths'];
    this.pieChartValues = [
      this.normalizedStats.active,
      this.normalizedStats.recovered,
      this.normalizedStats.deaths,
    ];
    this.pieChartDisplayValues = [
      this.unnormalizedStats.active,
      this.unnormalizedStats.recovered,
      this.unnormalizedStats.deaths,
    ];
    this.cdr.detectChanges();
  }

  private createRingChart(): void {
    this.ringChartLabels = [`Active`, `Critical`, `Tests`];
    this.ringChartValues = [
      this.normalizedStats.active,
      this.normalizedStats.critical,
      this.normalizedStats.tests,
    ];
    this.ringChartDisplayValues = [
      this.unnormalizedStats.active,
      this.unnormalizedStats.critical,
      this.unnormalizedStats.tests,
    ];
    this.cdr.detectChanges();
  }

  public handleNewStats(newStats: CovidStatisticsResponse[]) {
    newStats.forEach((stat) => {
      if (this.historyMap.has(stat.country)) {
        (this.historyMap.get(stat.country) as CovidStatisticsResponse[]).push(
          stat
        );
      } else if (stat.country === this._statistic?.country) {
        this.handleFetchHistory(this._statistic?.country);
      }
    });
  }

  private normalizeData(): void {
    this.unnormalizedStats = {
      deaths: this._statistic?.deaths.total ?? 0,
      cases: this._statistic?.cases.total ?? 0,
      tests: this._statistic?.tests.total ?? 0,
      recovered: this._statistic?.cases.recovered ?? 0,
      active: this._statistic?.cases.active ?? 0,
      critical: this._statistic?.cases.critical ?? 0,
      newCases: parseInt(this._statistic?.cases.new?.slice(1) ?? '0'),
      newDeaths: parseInt(this._statistic?.deaths.new?.slice(1) ?? '0'),
    };

    this.normalizedStats = { ...this.unnormalizedStats };
    normalizeObject([1000, 10000], this.normalizedStats);
  }

  private handleFetchHistory(country: string = 'All') {
    // console.error(this.ngHttpCachingService.getStore()); // check cached data

    // check not needed as response is cached but we are optimistically updating the values
    // with fetching statistics every 15 min
    if (this.historyMap.has(country)) {
      this.handleHistoryCharts();
      return;
    }

    this.covidDataService.getCountryHistory(country).subscribe({
      next: (value) => {
        this.historyMap.set(country, value);
        this.handleHistoryCharts();
      },
      error: (err) => {
        console.error('failed to fetch country history', err);
      },
    });
  }


  public get dateString() {
    if(this._statistic?.time){
      return parseDateToLocaleDateString(new Date(this._statistic!.time).toString(), false);
    }
    return null;
  }
}
