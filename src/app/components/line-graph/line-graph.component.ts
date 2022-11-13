import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  TuiDayRange,
  TuiDay,
  TuiDayLike,
  TuiStringHandler,
  tuiPure,
  TuiMonth,
} from '@taiga-ui/cdk';
import { TUI_MONTHS } from '@taiga-ui/core';
import { Observable, map } from 'rxjs';
import { CovidStatisticsResponse } from 'src/app/models/covid-data.model';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { toTuiDatetime } from '../../utils/date.utils';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineGraphComponent implements OnInit {
  private mapDateToStat: Map<string, CovidStatisticsResponse> = new Map();
  public isLineChartLoading: boolean = true;
  public range?: TuiDayRange;
  public casesValue: Array<[TuiDay, number]> = [];
  public deathsValue: Array<[TuiDay, number]> = [];

  readonly maxLength: TuiDayLike = { month: 3 };

  @Input()
  set history(hist: CovidStatisticsResponse[]) {
    if (hist && hist.length > 0) {
      this._history = hist;
      this.createLineGraphs();
    }
  }
  private _history: CovidStatisticsResponse[] = [];

  ngOnInit(): void {}

  constructor(
    @Inject(TUI_MONTHS) private readonly months$: Observable<readonly string[]>,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService
  ) {}

  private createLineGraphs() {
    this.isLineChartLoading = true;
    this.cdr.detectChanges();

    const mapping: any = this._history.map((value) => {
      const tuiDateTime = toTuiDatetime(value.day)!;
      return [tuiDateTime![0].toString(), value];
    });
    this.mapDateToStat = new Map(mapping);

    this.setRange();
    this.casesValue = this.computeValue(this.range!, true);
    this.deathsValue = this.computeValue(this.range!, false);

    this.isLineChartLoading = false;
    this.cdr.detectChanges();
  }

  private setRange() {
    const localRange: { from: string; to: string } | null =
      this.localStorage.getItem('range');
    if (localRange) {
      this.range = new TuiDayRange(
        toTuiDatetime(localRange.from)![0],
        toTuiDatetime(localRange.to)![0]
      );
      return;
    }
    const latestTuiDay = this._history[this._history.length - 1].day;
    this.range = new TuiDayRange(
      toTuiDatetime(latestTuiDay)![0],
      toTuiDatetime(latestTuiDay)![0].append({
        month: 2,
      })
    );
  }

  @tuiPure
  computeLabels$({ from, to }: TuiDayRange): Observable<string[]> {
    return this.months$.pipe(
      map((months) =>
        Array.from(
          { length: TuiMonth.lengthBetween(from, to) + 1 },
          (_, i) => months[from.append({ month: i }).month]
        )
      )
    );
  }

  @tuiPure
  private computeValue(
    { from, to }: TuiDayRange,
    isCase: boolean = true
  ): Array<[TuiDay, number]> {
    return new Array(TuiDay.lengthBetween(from, to) + 1)
      .fill(0)
      .reduce<Array<[TuiDay, number]>>((array, _, i) => {
        const newDate = from.append({ day: i });
        const stat = this.mapDateToStat.get(newDate.toString());
        const value = isCase ? stat?.cases.new : stat?.deaths.new;
        let updatedValue = parseInt(value?.slice(1) ?? '0');
        updatedValue =
          updatedValue > 100
            ? parseInt(value?.toString().slice(0, 2)!)
            : updatedValue; // todo: normalize
        const newObj: [TuiDay, number] = [newDate, updatedValue];
        return [...array, newObj];
      }, []);
  }

  readonly yStringify: TuiStringHandler<number> = (y) =>
    `+${y.toLocaleString(`en-US`, { maximumFractionDigits: 0 })}`;

  readonly xStringify$: Observable<TuiStringHandler<TuiDay>> =
    this.months$.pipe(
      map(
        (months) =>
          ({ month, day }) =>
            `${months[month]}, ${day}`
      )
    );

  public onRangeChange(value: any) {
    if (!this.range) {
      return;
    }
    this.casesValue = this.computeValue(this.range!, true);
    this.deathsValue = this.computeValue(this.range!, false);
    this.localStorage.setItem('range', this.range);

    this.cdr.detectChanges();
  }
}
