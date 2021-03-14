import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  constructor(private http: HttpClient) { }
  start(accessToken: string, postId: string, date: string, depth: string, horizon: string, restore: string): Observable<any> {
    return this.http.get<any>(`https://floodrb.ugatu.su/api/training.start?
    access_token=${accessToken}&
    post_id=${postId}&
    date=${date}&
    depth=${depth}&
    horizon=${horizon}
    `);
  }
  getStatus(accessToken: string, trainingId: string): Observable<any> {
    return this.http.get<any>(`https://floodrb.ugatu.su/api/training.getStatus?
    access_token=${accessToken}&
    training_id=${trainingId}`);
  }
}
