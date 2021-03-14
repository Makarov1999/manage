import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {async, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuth = false;
  private accessToken: string | null = '';
  constructor(private http: HttpClient) { }
  checkAuth(body: FormData): Observable<any>  {
    return this.http.post<any>('https://floodrb.ugatu.su/api/auth.direct', body);
  }
  checkLogout(): Observable<any> {
    const data: FormData = new FormData();
    data.append('access_token', this.getAccesToken());
    console.log(this.getAccesToken());
    return this.http.post<any>('https://floodrb.ugatu.su/api/auth.logout', data);
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
      }, 1000);
    });

  }
}
