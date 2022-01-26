import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ForecastAPIRoutes } from './prediction.constants';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  constructor(private http: HttpClient) {
  }

  init(accessToken: string, postId: string, startDate: string, finishDate: string, meteo: boolean = false): Observable<any> {
    console.log('Meteo ' + meteo.toString());
    console.log(`${ForecastAPIRoutes.Init}?
    access_token=${accessToken}&
    post_id=${postId}&
    date_start=${startDate}&
    date_end=${finishDate}&
    use_meteodata=${meteo}`);
    return this.http.get<any>(`${ForecastAPIRoutes.Init}?
    access_token=${accessToken}&
    post_id=${postId}&
    date_start=${startDate}&
    date_end=${finishDate}&
    use_meteodata=${meteo}`);
  }
  
  getLast(accessToken: string, postId: string): Observable<any> {
    return this.http.get<any>(`${ForecastAPIRoutes.GetLastForStation}?access_token=${accessToken}&post_id=${postId}`);
  }

  initAll(accessToken: string, startDate: string, finishDate: string, meteo: boolean = false): Observable<any> {
    console.log(meteo);
    return this.http.get<any>(`${ForecastAPIRoutes.InitAll}?
    access_token=${accessToken}&
    date_start=${startDate}&
    date_end=${finishDate}&
    use_meteodata=${meteo}`);
  }

  getLastForPosts(postIds: string, dateStart: string): Observable<any> {
    return this.http.get<any>(`${ForecastAPIRoutes.GetByStartDate}?post_ids=${postIds}&date_start=${dateStart}`);
  }
}
