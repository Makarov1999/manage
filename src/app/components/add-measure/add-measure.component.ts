import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import {MeasureService} from '../../services/measure/measure.service';

@Component({
  selector: 'app-add-measure',
  templateUrl: './add-measure.component.html',
  styleUrls: ['./add-measure.component.scss']
})
export class AddMeasureComponent implements OnInit {
  addForm = new FormGroup({
    date: new FormControl(),
    level: new FormControl(),
    temperature: new FormControl(),
    pressure: new FormControl(),
    wind: new FormControl(),
    snow: new FormControl(),
    fallout: new FormControl(),
  });
  formError = '';
  formSuccess = '';

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private measure: MeasureService
  ) { }

  ngOnInit(): void {
  }
  addFactData(): void {
    this.formError = '';
    let sendData = '';
    if (!this.addForm.controls.date.value || !this.addForm.controls.level.value) {
      this.formError = 'Дата и уровень воды обязательны для заполнения';
    } else {
      sendData += `access_token=${this.auth.getAccesToken()}&post_id=${this.route.snapshot.params.id}&date=${this.addForm.controls.date.value}&water_level=${this.addForm.controls.level.value}`;
      if (this.addForm.controls.temperature.value) {
        sendData += `&air_temp=${this.addForm.controls.temperature.value}`;
      }

      if (this.addForm.controls.pressure.value) {
        sendData += `&atmosphere_pressure=${this.addForm.controls.pressure.value}`;
      }

      if (this.addForm.controls.wind.value) {
        sendData += `&wind_speed=${this.addForm.controls.wind.value}`;
      }
      if (this.addForm.controls.snow.value) {
        sendData += `&snow_thickness=${this.addForm.controls.snow.value}`;
      }
      if (this.addForm.controls.fallout.value) {
        sendData += `&rainfall=${this.addForm.controls.fallout.value}`;
      }
      this.measure.add(sendData).subscribe((res) => {
        console.log(res);
        if (res.response.result) {
          this.formSuccess = 'Данные успешно добавлены';
          setTimeout(() => {
            this.formSuccess = '';
          }, 4000);

        } else {
          this.formError = 'Произошла ошибка при вставке данных';
          setTimeout(() => {
            this.formError = '';
          }, 5000);
        }
      });
    }
  }

}
