import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ReportsService} from '../../services/reports.service';
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reportLink = '';
  reportsForm = new FormGroup({
    date: new FormControl(moment().toDate())
  });
  formError = '';

  constructor(
    private auth: AuthService,
    private reportsService: ReportsService) { }

  ngOnInit(): void {
  }
  createAnalysisReport(): void {
    if (this.reportsForm.controls.date.value) {
      const submitDate = moment(this.reportsForm.controls.date.value).format('YYYY-MM-DD');
      this.reportsService.getAnalysisReport(this.auth.getAccesToken(), submitDate).subscribe((res) => {
        console.log(res);
        if (res.response) {
          this.reportLink = res.response.link;
          setTimeout(() => {
            this.reportLink = '';
          } , 10000);
        }
      });
    } else {
      this.formError = 'Дата для отчета сравнительного анализа является обязательной';
    }
  }

}
