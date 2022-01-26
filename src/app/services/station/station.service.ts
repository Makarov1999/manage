import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../../interfaces/api-response';
import { IStation } from 'src/interfaces/station';
import { StationsAPIRoutes } from './station.constants';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }
  getStations(): Observable<IApiResponse<IStation[]>> {
    return this.http.get<IApiResponse<IStation[]>>(StationsAPIRoutes.GetAll);
  }
}
