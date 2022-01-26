import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { FloodZonesAPIRoutes } from './danger-zones.constants';
@Injectable({
  providedIn: 'root'
})
export class DangerZonesService {

  constructor(private http: HttpClient) {
  }
  getDangerZones(): Observable<any> {
    return this.http.get<any>(FloodZonesAPIRoutes.Danger);
  }

  getLevels(level: number): Observable<any> {
    return this.http.get<any>(`${FloodZonesAPIRoutes.Level}-${level}.geojson`);
  }
}
