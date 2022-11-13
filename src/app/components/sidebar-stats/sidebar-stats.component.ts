import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CovidStatisticsResponse } from 'src/app/models/covid-data.model';

type stats = {
  deaths: number;
  cases: number;
  tests: number;
  recovered: number;
  active: number;
  critical: number;
  newCases: number;
  newDeaths: number;
};
type statKeys = keyof stats;

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
      this.handleGraphs();
    }
  }
  private _statistic?: CovidStatisticsResponse;
  private normalizedStats: stats = {
    deaths: 0,
    cases: 0,
    tests: 0,
    recovered: 0,
    active: 0,
    critical: 0,
    newCases: 0,
    newDeaths: 0,
  };

  public unnormalizedStats: stats = {
    deaths: 0,
    cases: 0,
    tests: 0,
    recovered: 0,
    active: 0,
    critical: 0,
    newCases: 0,
    newDeaths: 0,
  };

  public pieChartValues: number[] = [];
  public pieChartDisplayValues: number[] = [];
  public pieChartLabels: string[] = [];

  public ringChartValues: number[] = [];
  public ringChartDisplayValues: number[] = [];
  public ringChartLabels: string[] = [];
  public ringChartIndex = NaN;

  public barSetValues: number[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  private handleGraphs() {
    console.error('STATS', this._statistic);
    this.normalizeData();
    this.createPieChart();
    this.createRingChart();
    this.createBarChart();
  }

  private createBarChart() {
    this.barSetValues = [
      this.normalizedStats.newCases,
      this.normalizedStats.newDeaths,
    ];
    console.error(this.barSetValues);
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

  private normalizeData(): void {
    this.unnormalizedStats = {
      deaths: this._statistic?.deaths.total ?? 0,
      cases: this._statistic?.cases.total ?? 0,
      tests: this._statistic?.tests.total ?? 0,
      recovered: this._statistic?.cases.recovered ?? 0,
      active: this._statistic?.cases.active ?? 0,
      critical: this._statistic?.cases.critical ?? 0,
      newCases: parseInt(this._statistic?.cases.new?.slice(1) ?? '0'),
      newDeaths: parseInt(this._statistic?.deaths.new?.slice(1) ?? '0')
    };

    this.normalizedStats = {
      deaths: this._statistic?.deaths.total ?? 0,
      cases: this._statistic?.cases.total ?? 0,
      tests: this._statistic?.tests.total ?? 0,
      recovered: this._statistic?.cases.recovered ?? 0,
      active: this._statistic?.cases.active ?? 0,
      critical: this._statistic?.cases.critical ?? 0,
      newCases: parseInt(this._statistic?.cases.new?.slice(1) ?? '0'),
      newDeaths: parseInt(this._statistic?.deaths.new?.slice(1) ?? '0')
    };

    const range = [1000, 10000];
    const values = Object.values(this.normalizedStats);
    const min = Math.min.apply(Math, values);
    const max = Math.max.apply(Math, values);
    Object.keys(this.normalizedStats).forEach((elem) => {
      const el = elem as statKeys;
      this.normalizedStats[el] = this.normalizeWithRange(range, min, max, this.normalizedStats[el]);
    });
    console.error(this.normalizedStats);
  }

  private normalizeWithRange(range: number[], min: number, max: number, value: number): number {
    const variation = (range[1] - range[0]) / (max - min);
    const val = parseInt(
      (
        (value === 0 ? 0 : range[0]) +
        (value - min) * variation
      ).toFixed(2)
    );
    return val;
  }
}
