import {Component, OnInit } from '@angular/core';
import {StationService} from '../../services/station.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {ApiAnswerStations, Station} from '../../app.component';
import IPlacemarkOptions = ymaps.IPlacemarkOptions;
import {BORDER} from '../../border';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
  stations: Station[] = [];
  answer: ApiAnswerStations = {status: false, response: []};
  border: any = BORDER;
  isPopupOpen = false;
  currentMarker: Station = {
    id: 0,
    type: 'auto',
    name: '',
    location: {
      latitude: 0,
      longitude: 0
    }
  };
  public placemarkOptions: IPlacemarkOptions = {};

  constructor(private st: StationService, public auth: AuthService, private route: ActivatedRoute) {
}

  ngOnInit(): void {
    this.answer = this.route.snapshot.data.station;
    if (this.answer.status) {
      this.stations = this.answer.response;
    }
  }

  openStationInfo(station: Station): void {
    console.log(station);
    this.isPopupOpen = true;
    this.currentMarker = station;
  }

  popupClose(): void {
    this.isPopupOpen = false;
  }
}
