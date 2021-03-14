import {Component, OnInit} from '@angular/core';
import {StationService} from './services/station.service';
import {AuthService} from './services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

export interface Location {
  latitude: number;
  longitude: number;
}
export interface Station {
  id: number;
  type: string;
  name: string;
  location: Location;
}

export interface ApiAnswerStations {
  status: boolean;
  response: Array<Station>;
}

export interface BodyAuth {
  login: string;
  password: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'manage';
  stations: Station[] = [];
  isAuthFormOpen = false;
  isAuthMessageOpen = false;
  authMessageText = '';
  body: BodyAuth = {
    login: '',
    password: ''
  };
  constructor(private st: StationService, public auth: AuthService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.st.getStations().subscribe((answer) => {
      if (answer.status) {
        this.stations = answer.response;
      }
    });
  }
  openManagePanel(): void {
    if (!this.auth.getAuth()) {
      this.isAuthFormOpen = true;
    }
  }

  loginManage(e: Event): void {
    e.preventDefault();
    this.isAuthFormOpen = false;
    const formData = new FormData();
    formData.append('login', this.body.login);
    formData.append('password', this.body.password);
    this.auth.checkAuth(formData)
      .subscribe((answer) => {
        console.log(answer);
        if (answer.status === false) {
          console.log('Ошибка');
          this.authMessageText = answer.error.description;
          this.isAuthMessageOpen = true;
          setTimeout(() => {
            this.isAuthMessageOpen = false;
          }, 5000);
        } else {
          localStorage.setItem('access_token', answer.response.access_token);
          this.auth.setAccessToken(answer.response.access_token);
          this.auth.login();
          this.authMessageText = 'Вход в панель управления успешно выполнен';
          this.isAuthMessageOpen = true;
          setTimeout(() => {
            this.isAuthMessageOpen = false;
          }, 2000);
        }
      });
  }
  logoutManage(): void {
    this.auth.checkLogout().subscribe((answer) => {
      if (answer.status) {
        this.authMessageText = 'Выход из панели управления успешно выполнен';
        this.isAuthMessageOpen = true;
        this.auth.logout();
        localStorage.clear();
        this.router.navigate(['']);
        setTimeout(() => {
          this.isAuthMessageOpen = false;
        }, 2000);
      } else {
        this.authMessageText = 'Произошла ошибка при выходе';
        this.isAuthMessageOpen = true;
        setTimeout(() => {
          this.isAuthMessageOpen = false;
        }, 4000);
      }
    });

  }
}
