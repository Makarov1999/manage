import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MapComponent} from './components/map/map.component';
import {ManagePanelComponent} from './components/manage-panel/manage-panel.component';
import {AuthQuard} from './quards/auth.quard';
import {StationResolver} from './station.resolver';

const routes: Routes = [
  {path: '', component: MapComponent, resolve: {station: StationResolver}},
  {path: 'manage/:id', component: ManagePanelComponent, canActivate: [AuthQuard]},
  {path: '**', component: MapComponent, resolve: {station: StationResolver}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
