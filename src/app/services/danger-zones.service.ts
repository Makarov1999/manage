import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DangerZonesService {

  constructor(private http: HttpClient) { }
  getDangerZones(): Observable<any> {
    return this.http.get<any>('https://floodrb.ugatu.su/flood-zones/danger_zones.geojson');
  }
  getLevels(level: number): Observable<any> {
    return this.http.get<any>(`https://floodrb.ugatu.su/flood-zones/water_level-${level}.geojson`);
  }
}
