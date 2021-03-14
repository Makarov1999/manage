import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiAnswerStations} from '../app.component';


@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }
  getStations(): Observable<ApiAnswerStations> {
    return this.http.get<ApiAnswerStations>('https://floodrb.ugatu.su/api/posts.get?offset=0&count=100');
  }
}
