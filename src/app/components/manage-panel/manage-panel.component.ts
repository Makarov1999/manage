import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PredictionService} from '../../services/prediction.service';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {ReportsService} from '../../services/reports.service';

@Component({
  selector: 'app-manage-panel',
  templateUrl: './manage-panel.component.html',
  styleUrls: ['./manage-panel.component.scss']
})

export class ManagePanelComponent implements OnInit {
  startDatePredict: Date = new Date();
  finishDatePredict: Date = new Date();
  currentDate = Date.now();
  meteo = false;
  all = false;
  currentDatePredict = false;
  predictResult: any = [];
  predictStatus = '';
  formatPredict = 'decimal';
  reportLink = '';
  formError = '';
  predictAllStart = false;
  predictionForm = new FormGroup({
    days: new FormControl('1'),
    startDate: new FormControl(),
    finishDate: new FormControl(),
    meteo: new FormControl(),
    all: new FormControl(),
    format: new FormControl('decimal')
  });

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private predict: PredictionService,
    private datePipe: DatePipe,
    private router: Router,
    private reportService: ReportsService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {
    console.log(this.auth.getAccesToken());
    this.predict.getLast(this.auth.getAccesToken(), this.route.snapshot.params.id).subscribe((res) => {
      if (res.response && res.response.results) {
        if (res.response.results.length > 0) {
          console.log(res.response.results);
          this.predictResult = res.response.results;
        }
      }
    });
  }
  daysCountChange(): void {
  }
  getPredictData(accessToken: string, postId: string, startDate: string, finishDate: string, meteo: boolean): void {
    this.predictResult = [];
    this.predictStatus = '';
    let current = 1;
    const timer = setInterval(() => {
      this.predict.init(accessToken, postId, startDate, finishDate, meteo).subscribe((res) => {
        console.log(res);
        if (res.response.status === 'pending' || res.response.status === 'in_process') {
          this.predictStatus = 'in_process';
          current++;
        } else {
          if (res.response.status === 'finished') {
            this.currentDate = Date.now();
            this.predictResult = res.response.results;
            this.predictStatus = 'finished';
            console.log(this.predictResult);
            clearInterval(timer);
          } else {
            if (res.response.status === 'error') {
              this.formError = 'Произошла ошибка, возможно модель отсутствует';
              setTimeout(() => {
                this.formError = '';
              }, 7000);
              clearInterval(timer);
            }
            if (current > 15) {
              console.log('Превышено время ожидания');
              this.predictStatus = 'limit';
              clearInterval(timer);
            }
          }
        }
      });

    }, 3000);
  }
  startPredictAll(accessToken: string, startDate: string, finishDate: string, meteo: boolean): void {
    console.log('Прогноз по всем');
    this.predict.initAll(accessToken, startDate, finishDate, meteo).subscribe((res) => {
      console.log(res);
      if (res.response) {
          this.predictAllStart = true;
          setTimeout(() => {
            this.predictAllStart = false;
          }, 10000);
      }
    });
  }
  predictStart(): void {
    let startDateStr: any = '';
    let finishDateStr: any = '';
    this.formatPredict = this.predictionForm.controls.format.value;
    const controls = this.predictionForm.controls;
    console.log(controls);
    this.formError = '';
    if (this.currentDatePredict) {
       const startDate = new Date();
       const finishDate = new Date(startDate.getTime());
       finishDate.setTime(startDate.getTime() + (Number(controls.days.value) - 1) * 86440000.0);
       startDateStr = this.datePipe.transform(startDate, 'YYYY-MM-dd');
       finishDateStr = this.datePipe.transform(finishDate, 'YYYY-MM-dd');
       console.log(controls.all.value);
       if (controls.all.value === true) {
         this.startPredictAll(
           this.auth.getAccesToken(),
           startDateStr,
           finishDateStr,
           controls.meteo.value
         );
       } else {
         console.log(controls.meteo.value);
         this.getPredictData(
           this.auth.getAccesToken(),
           this.route.snapshot.params.id,
           startDateStr,
           finishDateStr,
           controls.meteo.value
         );
       }
     } else {

      if (!controls.startDate.value || !controls.finishDate.value) {
        this.formError = 'Дата начала прогноза и его окончания являются обязательными';
      } else {
        const startDate = moment(controls.startDate.value);
        const finishDate = moment(controls.finishDate.value);
        if (finishDate.diff(startDate, 'days') > 4) {
          this.formError = 'Прогоз доступен максимум на 5 дней';
        } else {
          startDateStr = this.datePipe.transform(controls.startDate.value, 'YYYY-MM-dd');
          finishDateStr = this.datePipe.transform(controls.finishDate.value, 'YYYY-MM-dd');
          if (controls.all.value === true) {
            this.startPredictAll(
              this.auth.getAccesToken(),
              startDateStr,
              finishDateStr,
              controls.meteo.value
            );
          } else {
            this.getPredictData(
              this.auth.getAccesToken(),
              this.route.snapshot.params.id,
              startDateStr,
              finishDateStr,
              controls.meteo.value
            );
          }
        }
      }
    }
  }
  changeCurrent(e: Event): void {
    e.preventDefault();
    this.currentDatePredict = !this.currentDatePredict;
  }

  getReport(): void {
    this.reportService.getReportFromLastForecasts(this.auth.getAccesToken()).subscribe((res) => {
      if (res.response) {
        this.reportLink = res.response.link;
        setTimeout(() => {
          this.reportLink = '';
        }, 15000);

      } else {
        this.formError = 'Произошла ошибка при формировании отчетов';
        setTimeout(() => {
          this.formError = '';
        }, 5000);
      }
    });
  }

  formatPredictChange(evt: Event): void {
    console.log(evt.target);
  }
  setAbsolute(num: number): number {
    return Math.abs(num);
  }
}
