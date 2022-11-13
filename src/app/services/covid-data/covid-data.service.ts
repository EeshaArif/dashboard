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
import { NgHttpCachingHeaders } from 'ng-http-caching';

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

  public getCountryHistory(country: string = 'All', day?: string) {
    const params: { country: string; day?: string } = {
      country: country,
    };
    if (day) {
      params.day = day;
    }
    return this.http
      .get<CovidStatisticsQueryResponse>(`${API_URL}/history`, {
        params: params,
        headers: this.generateHeaders(country),
      })
      .pipe(
        map((result) => {
          if (result.errors && result.errors.length > 0) {
            throw result.errors;
          }
          return result.response as CovidStatisticsResponse[];
        }),
        catchError((err, _) => {
          return this.handleError(err, `get ${country} history`);
        })
      );
  }

  public getCovidStatistics() {
    return this.http
      .get<CovidStatisticsQueryResponse>(`${API_URL}/statistics`, {
        headers: this.generateHeaders('history', true),
      })
      .pipe(
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

  private generateHeaders = (tag: string, disallowCache: boolean = false) => {
    const headers: any = {
      'Content-Type': 'application/json',
      'x-rapidapi-host': 'covid-193.p.rapidapi.com',
      'x-rapidapi-key': '809c8c48f7msh6730025a57fda0dp12e700jsnc859de5b6db5',
      [NgHttpCachingHeaders.TAG]: tag,
    };
    if (disallowCache) {
      headers[NgHttpCachingHeaders.DISALLOW_CACHE] = '1';
    }
    return new HttpHeaders(headers);
  };
}
