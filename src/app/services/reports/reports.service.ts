import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportsAPIRoutes } from './reports.constants';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }
  getReportFromLastForecasts(accessToken: string): Observable<any> {
    return this.http.get<any>(`${ReportsAPIRoutes.LastForecasts}?access_token=${accessToken}`);
  }
  getAnalysisReport(accessToken: string, date: string): Observable<any> {
    return this.http.get<any>(`${ReportsAPIRoutes.Analysis}?access_token=${accessToken}&date=${date}`);
  }
}
