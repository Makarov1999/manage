import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import {async, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthQuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, route: ActivatedRoute) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>  | Promise<boolean> |  boolean {
    return this.auth.isAuthenticated().then( isAuth => {
      if (isAuth || localStorage.getItem('access_token')) {
        if (localStorage.getItem('access_token')) {
          this.auth.setAccessToken(localStorage.getItem('access_token'));
          this.auth.login();
        }
        return true;
      } else {
        return false;
      }
    });
  }
}
