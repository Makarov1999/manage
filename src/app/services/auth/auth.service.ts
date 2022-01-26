import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthAPIRoutes } from './auth.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuth = false;
  private accessToken: string | null = '';

  constructor(private http: HttpClient) {
  }

  checkAuth(body: FormData): Observable<any>  {
    return this.http.post<any>(AuthAPIRoutes.Direct, body);
  }

  checkLogout(): Observable<any> {
    const data: FormData = new FormData();
    data.append('access_token', this.getAccesToken());
    console.log(this.getAccesToken());
    return this.http.post<any>(AuthAPIRoutes.Logout, data);
  }

  login(): void {
    this.isAuth = true;
  }

  logout(): void {
    this.isAuth = false;
  }

  setAccessToken(accessToken: string | null): void {
    this.accessToken = accessToken;
  }

  getAccesToken(): any {
    return this.accessToken;
  }

  getAuth(): boolean {
    return this.isAuth;
  }

  isAuthenticated(): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.isAuth);
      }, 100);
    });

  }
}
