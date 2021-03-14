import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PredictionService} from '../../services/prediction.service';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-panel',
  templateUrl: './manage-panel.component.html',
  styleUrls: ['./manage-panel.component.scss']
})

export class ManagePanelComponent implements OnInit {
  startDatePredict: Date = new Date();
  finishDatePredict: Date = new Date();
  currentDatePredict = false;
  predictResult: any = [];
  predictStatus = '';
  formError = '';
  predictionForm = new FormGroup({
    days: new FormControl('1'),
    startDate: new FormControl(),
    finishDate: new FormControl()
  });

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private predict: PredictionService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {
    console.log(this.auth.getAccesToken());
    this.predict.getLast(this.auth.getAccesToken(), this.route.snapshot.params.id).subscribe((res) => {
      if (res.response) {
        if (res.response.results.length > 0) {
          this.predictResult = res.response.results;
        }
      }
    });
  }
  daysCountChange(): void {
  }
  getPredictData(accessToken: string, postId: string, startDate: string, finishDate: string): void {
    this.predictResult = [];
    this.predictStatus = '';
    let current = 1;
    const timer = setInterval(() => {
      this.predict.init(accessToken, postId, startDate, finishDate).subscribe((res) => {
        console.log(res);
        if (res.response.status === 'pending' || res.response.status === 'in_process') {
          this.predictStatus = 'in_process';
          current++;
        } else {
          if (res.response.status === 'finished') {
            this.predictResult = res.response.results;
            this.predictStatus = 'finished';
            console.log(this.predictResult);
            clearInterval(timer);
          } else {
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
  predictStart(): void {
    let startDateStr: any = '';
    let finishDateStr: any = '';
    const controls = this.predictionForm.controls;
    this.formError = '';
    if (this.currentDatePredict) {
       const startDate = new Date();
       const finishDate = new Date(startDate.getTime());
       finishDate.setTime(startDate.getTime() + (Number(controls.days.value) - 1) * 86440000.0);
       startDateStr = this.datePipe.transform(startDate, 'YYYY-MM-dd');
       finishDateStr = this.datePipe.transform(finishDate, 'YYYY-MM-dd');
       this.getPredictData(this.auth.getAccesToken(), this.route.snapshot.params.id, startDateStr, finishDateStr);
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
          this.getPredictData(this.auth.getAccesToken(), this.route.snapshot.params.id, startDateStr, finishDateStr);
        }
      }
    }
  }
  changeCurrent(e: Event): void {
    e.preventDefault();
    this.currentDatePredict = !this.currentDatePredict;
  }

}
