import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { StationService } from './services/station/station.service';
import { Observable } from 'rxjs';
import { IApiResponse } from '../interfaces/api-response'
import { Injectable } from '@angular/core';
import { IStation } from 'src/interfaces/station';

@Injectable(
  {providedIn: 'root'}
  )
export class StationResolver implements Resolve<IApiResponse<IStation[]>> {
  constructor(private st: StationService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<IApiResponse<IStation[]>> |
    Promise<IApiResponse<IStation[]>> |
    IApiResponse<IStation[]> {
    return this.st.getStations();
  }
}
