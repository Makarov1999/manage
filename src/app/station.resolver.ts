import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {StationService} from './services/station.service';
import {Observable} from 'rxjs';
import {ApiAnswerStations} from './app.component';
import {Injectable} from '@angular/core';

@Injectable(
  {providedIn: 'root'}
  )
export class StationResolver implements Resolve<ApiAnswerStations> {
  constructor(private st: StationService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<ApiAnswerStations> |
    Promise<ApiAnswerStations> |
    ApiAnswerStations {
    return this.st.getStations();
  }
}
