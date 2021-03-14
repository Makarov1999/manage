import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { ManagePanelComponent } from './components/manage-panel/manage-panel.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MY_DATE_FORMATS} from './my-date-formats';
import {CommonModule, DatePipe} from '@angular/common';
import { AddMeasureComponent } from './components/add-measure/add-measure.component';
import { MeasureComponent } from './components/measure/measure.component';
import {ChartsModule} from 'ng2-charts';
import { EducationComponent } from './components/education/education.component';



const mapConfig: YaConfig = {
  apikey: 'a44a4cda-457c-46f7-8eb6-67f84b41fcec',
  lang: 'ru_RU',
};
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ManagePanelComponent,
    AddMeasureComponent,
    MeasureComponent,
    EducationComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularYandexMapsModule.forRoot(mapConfig),
        HttpClientModule,
        FormsModule,
        RouterModule,
        BrowserAnimationsModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        CommonModule,
        ChartsModule
    ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
    DatePipe
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
