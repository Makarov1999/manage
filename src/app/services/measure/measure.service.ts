import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { MeasureAPIRoutes } from './measure.constants';
import { IMeasureApi } from 'src/interfaces/measure-api';
import { IApiResponse } from 'src/interfaces/api-response';
import { IMeasure } from 'src/interfaces/measure';
import { map } from 'rxjs/operators'; 
import { adaptToClient } from 'src/utils/adapt-to-client';
@Injectable({
  providedIn: 'root'
})

export class MeasureService {

  constructor(private http: HttpClient) {
  }

  add(data: string): Observable<any> {
    return this.http.get<any>(`${MeasureAPIRoutes.Add}?${data}`);
  }

  getLastWeek(accesToken: string, postId: string): Observable<any> {
    const finishDate = moment();
    const startDate = moment().add(-6, 'd');
    console.log(startDate.format('YYYY-MM-DD'));
    console.log(finishDate.format('YYYY-MM-DD'));
    return this.http.get<any>(
      `${MeasureAPIRoutes.Get}?
      access_token=${accesToken}&
      post_id=${postId}&
      date_start=${startDate.format('YYYY-MM-DD')}
      &date_end=${finishDate.format('YYYY-MM-DD')}`
    );
  }

  addExternalData(body: FormData): Observable<any> {
    return this.http.post<any>(MeasureAPIRoutes.AddExternal, body);
  }

  getMeasurementsForPosts(postIds: string, dateStart: string, dateEnd: string): Observable<any> {
    return this.http.get<IApiResponse<IMeasureApi[][]>>(
      `${MeasureAPIRoutes.GetByPostIds}?
      post_ids=${postIds}&
      date_start=${dateStart}&
      date_end=${dateEnd}`)
      .pipe(map((res) => 
        res.response?.map((measures) => measures.map((measure) => adaptToClient<IMeasureApi, IMeasure>(measure)))
      ));
  }

  getMeasurementsByDate(accesToken: string, postId: string, dateStart: string, dateEnd: string): Observable<any> {
    return this.http.get<any>(`${MeasureAPIRoutes.Get}?access_token=${accesToken}&post_id=${postId}&date_start=${dateStart}&date_end=${dateEnd}`);
  }
}
