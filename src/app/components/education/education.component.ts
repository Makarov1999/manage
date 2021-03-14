import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {EducationService} from '../../services/education.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  constructor(private route: ActivatedRoute, private auth: AuthService, private education: EducationService) { }
  formSuccess = '';
  formError = '';
  barValue = '';
  idEducation = '';
  educationForm = new FormGroup({
    date: new FormControl(),
    depth: new FormControl(),
    horizon: new FormControl(),
    restore: new FormControl()
  });

  ngOnInit(): void {
  }
  processEducation(date: string, depth: string, horizon: string, restore: string): void {
    let current = 1;
    console.log(this.route.snapshot.params.id);
    console.log(date);
    console.log(horizon);
    console.log(restore);
    this.education.start(
      this.auth.getAccesToken(), this.route.snapshot.params.id, date, depth, horizon, restore).subscribe((res) => {
      console.log(res);
      if (res.response.id) {
        this.idEducation = res.response.id.toString();
        console.log(this.idEducation);
        const timer = setInterval(() => {
          this.education.getStatus(this.auth.getAccesToken(), this.idEducation).subscribe((ans) => {
            console.log(ans);
            current++;
            if (ans.response.status === 'pending') {
              this.formSuccess = 'Ожидание обучения';
              setTimeout(() => {
                this.formSuccess = '';
              }, 3000);
            }
            if (ans.response.status === 'in_process') {
              this.barValue = (Number(ans.response.progress) * 100).toString() + '%';
            }
            if (ans.response.status === 'finished') {
              this.formSuccess = 'Обучение успешно выполнено';
              this.barValue = '';
              setTimeout(() => {
                this.formSuccess = '';
              }, 3000);
              clearInterval(timer);
            }
            if (current === 25) {
              this.barValue = '';
              this.formError = 'Превышено время ожидания';
              setTimeout(() => {
                this.formError = '';
              }, 3000);
              clearInterval(timer);
            }
            if (ans.error) {
              this.formError = 'Произошла ошибка при обучении';
              setTimeout(() => {
                this.formError = '';
              }, 5000);
            }
          });
        }, 10000);
      } else {
        this.formError = 'Произошла ошибка при обучении';
        setTimeout(() => {
          this.formError = '';
        }, 5000);
      }
    });
  }

  educationSubmit(): void {
    this.formError = '';
    let date = '';
    let depth = '';
    let horizon = '';
    let restore = '';
    if (!this.educationForm.controls.date.value || !this.educationForm.controls.depth.value || !this.educationForm.controls.horizon.value) {
      this.formError = 'Дата, глубина и горизонт являются обязательными параметрами';
    } else {
      date = this.educationForm.controls.date.value;
      depth = this.educationForm.controls.depth.value;
      horizon = this.educationForm.controls.horizon.value;
      if (this.educationForm.controls.restore.value) {
        restore = 'true';
      } else {
        restore = 'false';
      }
      this.processEducation(date, depth, horizon, restore);
    }
  }
}
