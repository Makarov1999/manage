import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MeasureService} from '../../services/measure.service';
import {ActivatedRoute} from '@angular/router';
import {ChartDataSets, ChartType} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {FormControl, FormGroup} from '@angular/forms';
import {PredictionService} from '../../services/prediction.service';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.scss']
})
export class MeasureComponent implements OnInit {
  chartData: ChartDataSets[] = [{
    data: [],
    label: 'Уровень воды'
  }, {
    data: [],
    label: 'Прогноз',
    borderColor: '#0000ff',
    backgroundColor: 'transparent'
  }];
  formError = '';
  chartForm = new FormGroup({
    dateStart: new FormControl(moment().add(-6, 'days').toDate()),
    dateEnd: new FormControl(moment().toDate())
  });
  chartLabels: Label[] = [];
  chartOptions = {
    responsive: true
  };
  chartColors: Color[] = [
    {
      borderColor: '#444444',
      backgroundColor: 'transparent'
    }
  ];
  chartLegend = true;
  chartPlugins = [];
  mychartType: ChartType = 'line';
  levels: any[] = [];
  startDate = moment().add(-6, 'days').format('DD.MM.YYYY');
  finishDate = moment().format('DD.MM.YYYY');

  constructor(
    private auth: AuthService,
    private measure: MeasureService,
    private route: ActivatedRoute,
    private router: Router,
    private predictionService: PredictionService) { }

  ngOnInit(): void {
    this.startDate = moment().add(-6, 'days').format('DD.MM.YYYY');
    this.finishDate = moment().format('DD.MM.YYYY');
    this.levels = [];
    this.chartData[0].data = [];
    this.chartData[1].data = [];
    this.chartLabels = [];
    this.measure.getLastWeek(this.auth.getAccesToken(), this.route.snapshot.params.id).subscribe((res) => {
      console.log(res);
      if (res.response) {
        if (res.response.length > 1) {
          this.levels = res.response;
          for (const level of this.levels) {
            this.chartData[0]?.data?.push(level.water_level);
            this.chartLabels.push(moment(level.date * 1000).format('DD.MM.YYYY'));
          }
        }
        this.predictionService.getLastForPosts(this.route.snapshot.params.id, moment().add(-6, 'days').format('YYYY-MM-DD'))
          .subscribe((result) => {
          if (result.response[0]) {
            console.log(result.response);
            const predicts = result.response;
            for (const predict of predicts[0].results) {
              this.chartData[1].data?.push(predict.forecast_value);
            }
          }
        });
      } else {
        if (res.error.code === 101) {
          localStorage.clear();
          this.auth.logout();
          this.router.navigate(['']);
        }

      }
    });
  }
  updateChart(): void {
    this.chartData[0].data = [];
    this.chartData[1].data = [];
    this.chartLabels = [];
    this.ngOnInit();
  }
  submitDatesForChart(): void {
    if (this.chartForm.controls.dateStart.value && this.chartForm.controls.dateEnd.value) {
      this.chartData[0].data = [];
      this.chartData[1].data = [];
      this.chartLabels = [];
      const startDate = moment(this.chartForm.controls.dateStart.value).format('YYYY-MM-DD');
      const finishDate = moment(this.chartForm.controls.dateEnd.value).format('YYYY-MM-DD');
      this.measure.getMeasurementsByDate(this.auth.getAccesToken(), this.route.snapshot.params.id, startDate, finishDate)
        .subscribe((res) => {
        if (res.response) {
          if (res.response.length > 1) {
            this.levels = res.response;
            for (const level of this.levels) {
              this.chartData[0]?.data?.push(level.water_level);
              this.chartLabels.push(moment(level.date * 1000).format('DD.MM.YYYY'));
            }
          }
        }
      });
      this.predictionService.getLastForPosts([this.route.snapshot.params.id].join(','), startDate)
        .subscribe((result) => {
          console.log(result);
          if (result.response[0]) {
            console.log(result.response);
            const predicts = result.response;
            for (const predict of predicts[0].results) {
              this.chartData[1].data?.push(predict.forecast_value);
            }
          }
        });

    } else {
      this.formError = 'Необходимо заполнить даты начала и окончания';
      setTimeout(() => {
        this.formError = '';
      }, 7000);
    }

  }
}
