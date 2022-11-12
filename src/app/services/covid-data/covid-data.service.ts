import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CovidStatisticsResponse } from '../../models/covid-data.model';
import { NotificationService } from '../notification/notification.service';

const API_URL = 'https://covid-193.p.rapidapi.com';

type CovidStatisticsQueryResponse = {
  errors?: any[];
  response: CovidStatisticsResponse[];
};

@Injectable({
  providedIn: 'root',
})
export class CovidDataService {
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}
  // getGraderListV2Query =
  // this.getGraderListV2Query.watch(params, {
  //   fetchPolicy: "network-only",
  //   nextFetchPolicy: "network-only",
  //   pollInterval: POLL_INTERVAL
  // });
  public getCovidStatistics() {
    return this.http.get<CovidStatisticsQueryResponse>(`${API_URL}/statistics`, this.generateHeaders()).pipe(
      map((result) => {
        if (result.errors && result.errors.length > 0) {
          throw result.errors;
        }
        return result.response as CovidStatisticsResponse[];
      }),
      catchError((err, _) => {
        return this.handleError(err, 'get covid statistics');
      })
    );
  }

  private handleError(error: HttpErrorResponse, action: string) {
    const message = `failed to ${action}`;
    this.notificationService.openErrorAlert(error, message);
    return throwError(() => new Error(message));
  }

  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'covid-193.p.rapidapi.com',
        'x-rapidapi-key': '809c8c48f7msh6730025a57fda0dp12e700jsnc859de5b6db5',
      }),
    };
  };
}
