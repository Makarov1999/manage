import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MeasureService} from '../../services/measure.service';
import {ActivatedRoute} from '@angular/router';
import {ChartDataSets, ChartType} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.scss']
})
export class MeasureComponent implements OnInit {
  chartData: ChartDataSets[] = [{
    data: [],
    label: 'Уровень воды'
  }];
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

  constructor(private auth: AuthService, private measure: MeasureService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.startDate = moment().add(-6, 'days').format('DD.MM.YYYY');
    this.finishDate = moment().format('DD.MM.YYYY');
    this.levels = [];
    this.chartData[0].data = [];
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
    this.ngOnInit();
  }
}
