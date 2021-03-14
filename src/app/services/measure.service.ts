import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MeasureService {

  constructor(private http: HttpClient) {
  }
  add(data: string): Observable<any> {
    return this.http.get<any>(`https://floodrb.ugatu.su/api/measurements.add?${data}`);
  }
  getLastWeek(accesToken: string, postId: string): Observable<any> {
    const finishDate = moment();
    const startDate = moment().add(-6, 'd');
    console.log(startDate.format('YYYY-MM-DD'));
    console.log(finishDate.format('YYYY-MM-DD'));
    return this.http.get<any>(`https://floodrb.ugatu.su/api/measurements.get?access_token=${accesToken}&post_id=${postId}&date_start=${startDate.format('YYYY-MM-DD')}&date_end=${finishDate.format('YYYY-MM-DD')}`);
  }
}
