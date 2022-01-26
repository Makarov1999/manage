import { Component, OnInit } from '@angular/core';
import {MeasureService} from '../../services/measure/measure.service';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add-external',
  templateUrl: './add-external.component.html',
  styleUrls: ['./add-external.component.scss']
})
export class AddExternalComponent implements OnInit {
  formSuccess = '';
  formError = '';
  addFormExternal = new FormGroup({
    date: new FormControl(),
    level: new FormControl()
  });

  constructor(
    private auth: AuthService,
    private addService: MeasureService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }
  addExternalData(): void {
    console.log(this.addFormExternal.controls);
    if (!this.addFormExternal.controls.date.value || !this.addFormExternal.controls.level.value) {
      this.formError = 'Поля даты и значения уровня являются обязательными';
      setTimeout(() => {
        this.formError = '';
      }, 5000);
    } else {
      const providerId = '2';
      const data = new FormData();
      data.append('access_token', this.auth.getAccesToken());
      data.append('post_id', this.route.snapshot.params.id);
      data.append('provider_id', providerId);
      data.append('date', this.addFormExternal.controls.date.value);
      data.append('value', this.addFormExternal.controls.level.value);
      this.addService.addExternalData(data).subscribe((res) => {
        if (res.response) {
          if (res.response.id) {
            this.formSuccess = 'Данные успешно добавлены';
            setTimeout(() => {
              this.formSuccess = '';
            }, 3000);
          }
        } else {
          this.formError = 'Произошла ошибка при добавлении данных';
          setTimeout(() => {
            this.formError = '';
          }, 5000);
        }
      });

    }
  }

}
