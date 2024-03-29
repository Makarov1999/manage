import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingAPIRoutes } from './education.constants';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  constructor(private http: HttpClient) { }
  start(accessToken: string, postId: string, date: string, depth: string, horizon: string, restore: string): Observable<any> {
    return this.http.get<any>(`${TrainingAPIRoutes.Start}?
    access_token=${accessToken}&
    post_id=${postId}&
    date=${date}&
    depth=${depth}&
    horizon=${horizon}
    `);
  }
  getStatus(accessToken: string, trainingId: string): Observable<any> {
    return this.http.get<any>(`${TrainingAPIRoutes.GetStatus}?
    access_token=${accessToken}&
    training_id=${trainingId}`);
  }
}
