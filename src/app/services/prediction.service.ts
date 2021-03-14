import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  constructor(private http: HttpClient) {
  }
  init(accessToken: string, postId: string, startDate: string, finishDate: string): Observable<any> {
    console.log(postId);
    return this.http.get<any>(`https://floodrb.ugatu.su/api/forecast.init?
    access_token=${accessToken}&
    post_id=${postId}&
    date_start=${startDate}&
    date_end=${finishDate}`);
  }
  getLast(accessToken: string, postId: string): Observable<any> {
    return this.http.get<any>(`https://floodrb.ugatu.su/api/forecast.getLastForPost?access_token=${accessToken}&post_id=${postId}`);
  }
}
