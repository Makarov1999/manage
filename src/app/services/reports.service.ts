import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }
  getReportFromLastForecasts(accessToken: string): Observable<any> {
    return this.http.get<any>(`https://floodrb.ugatu.su/api/reports.createFromLastForecasts?access_token=${accessToken}`);
  }
  getAnalysisReport(accessToken: string, date: string): Observable<any> {
    return this.http.get<any>(`https://floodrb.ugatu.su/api/reports.createAnalysisForDays?access_token=${accessToken}&date=${date}`);
  }
}
