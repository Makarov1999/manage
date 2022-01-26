import {AfterViewChecked, ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {StationService} from '../../services/station/station.service';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BORDER} from '../../border';
import {precBorder} from '../../prec-border';
import * as L from 'leaflet';
import {geoJSON, GeoJSON, icon, latLng, tileLayer} from 'leaflet';
import {CustomMarker} from '../../custom';
import {Feature} from '../../bash';
import {FormControl, FormGroup} from '@angular/forms';
import {DangerZonesService} from '../../services/danger-zones/danger-zones.service';
import {ZoneData} from '../../zone-data';
import {DefaultZoneValues, ZonesPosts} from '../../consts';
import {MeasureService} from '../../services/measure/measure.service';
import * as moment from 'moment';
import {PredictionService} from '../../services/prediction/prediction.service';
import { IStation } from 'src/interfaces/station';
import { IApiResponse } from 'src/interfaces/api-response';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})


export class MapComponent implements OnInit, AfterViewChecked {
  map: any;
  zones: any = {};
  isZoneFormOpen = false;
  resultZones: any = {
    type: 'FeatureCollection',
    name: 'result-zones',
    features: []
  };
  resultDangerZones: any = {
    type: 'FeatureCollection',
    name: 'result-danger-zones',
    features: []
  };
  stations: IStation[] = [];
  postName = '';
  dangerZones: any = {};
  isSearchOpen = false;
  formSearch = new FormGroup({
    name: new FormControl(),
    filter: new FormControl(),
    river: new FormControl()
  });
  formZones = new FormGroup({
    date: new FormControl(),
    dataType: new FormControl('fact')
  });
  featureStyle: any = {
    color: '#5865db',
    weight: 2,
    opacity: 0.65,
    fillColor: 'transparent'
  };
  featureStyleDangerZones: any = {
    color: '#ff0000',
    weight: 3,
    opacity: 1,
    fillColor: '#ff0000',
    fillOpacity: 0.3
  };
  featureStyleWaterLevel: any = {
    color: '#0000ff',
    weight: 3,
    opacity: 0.7,
    fillColor: '#0000ff'
  };
  answer: IApiResponse<IStation[]> = {status: false, response: []};
  border: any = BORDER;
  isPopupOpen = false;
  markers: any[] = [];
  rivers: string[] = [];
  originalMarkers: any[] = [];
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      geoJSON(precBorder, {style: this.featureStyle})
    ],
    zoom: 8,
    center: latLng([ 54.7431, 55.9678])
  };
  currentMarker: IStation = {
    id: 0,
    type: 'auto',
    name: '',
    location: {
      latitude: 0,
      longitude: 0
    },
    flood: 0,
    floodplain: 0
  };
  formError = '';
  isLegendOpen = false;

  constructor(
    private st: StationService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    private router: Router,
    private zone: NgZone,
    private zonesService: DangerZonesService,
    private measureService: MeasureService,
    private  predictionService: PredictionService
  ) {
}

  ngOnInit(): void {
    this.answer = this.route.snapshot.data.station;
    if (this.answer.response) {
      this.stations = this.answer.response;
      for (const station of this.stations) {
        let river = '';
        const riversList = station.name.split('(');
        river = riversList[0];
        this.rivers.push(river);
      }
      this.rivers = [...new Set(this.rivers)];
      for (const st of this.stations) {
        const lat = st.location.latitude;
        const long = st.location.longitude;
        let iconUrl = '';
        if (st.type === 'auto') {
          iconUrl = 'https://api.geoapify.com/v1/icon/?type=material&color=%2329418e&icon=brightness_auto&iconType=material&apiKey=7e90dab7c9a541928f37e671633db7da';
        } else {
          iconUrl = 'https://api.geoapify.com/v1/icon/?type=material&color=%2329418e&icon=brightness_low&iconType=material&apiKey=7e90dab7c9a541928f37e671633db7da';
        }
        const mark = new CustomMarker([lat, long], st, {icon: icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl
          })}).on('click' , (e) => {
          this.zone.run(() => {
            this.isPopupOpen = true;
            this.currentMarker = e.target.data;
          });
        });
        this.markers.push(mark);
      }
      this.originalMarkers = this.markers.slice();
    }
    for (let i = 300; i < 1100; i += 100) {
      this.zonesService.getLevels(i).subscribe((res) => {
        this.zones['zones' + i.toString()] = res.features;
      });
    }
    console.log(this.zones);
    this.zonesService.getDangerZones().subscribe((res) => {
      console.log(res);
      this.dangerZones = res;
    });
  }
  ngAfterViewChecked(): void {
    this.cdref.detectChanges();
  }

  openStationInfo(station: IStation): void {
    this.currentMarker = station;
    this.isPopupOpen = true;

  }

  popupClose(): void {
    this.isPopupOpen = false;
  }
  onMapReady(map: L.Map): void {
    this.map = map;
  }
  searchSubmit(): void {
    console.log(this.formSearch.controls);
    let name = '';
    let river = '';
    const filter = this.formSearch.controls.filter.value ? this.formSearch.controls.filter.value : 'all';
    if (this.formSearch.controls.name.value) {
      name = this.formSearch.controls.name.value;
    }
    if (this.formSearch.controls.river.value) {
      river = this.formSearch.controls.river.value;
    }
    // this.formSearch.reset({filter: 'all'});
    this.markers = this.originalMarkers.slice();
    if (filter !== 'all') {
      this.markers = this.markers.filter((mark: any) => {
        return mark.data.type === filter;
      });
    }
    console.log(river);
    this.markers = this.markers.filter((mark: any) => {
      return mark.data.name.includes(river);
    });
    this.markers = this.markers.filter((mark: any) => {
      return mark.data.name.includes(name);
    });
  }
  resetSearch(): void {
    this.formSearch.reset({filter: 'all'});
    this.markers = this.originalMarkers.slice();
  }

  openSearch(): void {
    this.isSearchOpen = true;
  }
  closeSearch(): void {
    this.resetSearch();
    this.isSearchOpen = false;
  }
  setZones(zonesData: ZoneData[]): void {
    console.log(zonesData);
    const features = [];
    const dangerZonesFeatures = [];
    let zoneFilter = [];
    for (let i = 0; i < zonesData.length; i++) {
      console.log(i);
    }
    for (const data of zonesData) {
      zoneFilter = [];
      if (data.value < 300) {
        zoneFilter = this.zones.zones300.filter((zone: any) => {
          return data.postId === zone.properties[`POST_ID`];
        });
      }
      if (data.value >=  300 && data.value <= 400) {
        console.log('400 level');
        zoneFilter = this.zones.zones400.filter((zone: any) => {
          return data.postId === zone.properties[`POST_ID`];
        });
      }
      if (data.value > 400 && data.value <= 500) {
        zoneFilter = this.zones.zones500.filter((zone: any) => {
          return data.postId === zone.properties[`POST_ID`];
        });
      }
      if (data.value > 500 && data.value <= 600) {
        zoneFilter = this.zones.zones600.filter((zone: any) => {
          return data.postId === zone.properties[`POST_ID`];
        });
      }
      if (data.value > 600 && data.value <= 700) {
        zoneFilter = this.zones.zones700.filter((zone: any) => {
          return data.postId === zone.properties[`POST_ID`];
        });
      }
      if (data.value > 700 && data.value <= 800) {
        zoneFilter = this.zones.zones800.filter((zone: any) => {
          return data.postId === zone.properties[`POST_ID`];
        });
      }
      if (data.value > 900) {
        zoneFilter = this.zones.zones1000.filter((zone: any) => {
          return data.postId === zone.properties[`POST_ID`];
        });
      }
      if (zoneFilter.length === 1) {
        features.push(zoneFilter[0]);
      }
    }
    for (const feature of features) {
      console.log(this.dangerZones.features);
      let dangerZoneFilter = [];
      dangerZoneFilter = this.dangerZones.features.filter((value: any) => {
        return value.properties[`POST_ID`] === feature.properties[`POST_ID`];
      });
      if (dangerZoneFilter.length === 1) {
        dangerZonesFeatures.push(dangerZoneFilter[0]);
      }
    }
    this.resultZones.features = features;
    this.resultDangerZones.features = dangerZonesFeatures;
    console.log(dangerZonesFeatures);
    console.log(features);
  }
  // getZones(): void {
  //   this.setZones(DefaultZoneValues);
  //   this.markers.push(new GeoJSON(this.dangerZones, this.featureStyleDangerZones));
  //   this.markers.push(new GeoJSON(this.resultZones, this.featureStyleWaterLevel));
  // }

  zonesSubmit(): void {
    let postIds = '';
    const zonesData: ZoneData[] = [];
    if (this.formZones.controls.date.value) {
        if (this.formZones.controls.dataType.value === 'fact') {
          const date = moment(this.formZones.controls.date.value).format('YYYY-MM-DD');
          postIds = ZonesPosts.join(',');
          this.measureService.getMeasurementsForPosts(postIds, date, date).subscribe((res) => {
            console.log(res);
            if (res) {
              const zones = res;
              console.log(zones);
              for (const zone of zones) {
                const zoneElement: ZoneData = {postId: 0, value: 0};
                if (zone.length > 0) {
                  zoneElement.postId = zone[0].postId;
                  zoneElement.value = zone[0].waterLevel;
                  zonesData.push(zoneElement);
                }
              }
              this.setZones(zonesData);
              this.resetZones();
              console.log(this.resultDangerZones);
              console.log(this.resultZones);
              console.log(this.dangerZones);
              this.markers.push(new GeoJSON(this.resultDangerZones, this.featureStyleDangerZones));
              this.markers.push(new GeoJSON(this.resultZones, this.featureStyleWaterLevel));
            }
          });
        } else {
          if (this.formZones.controls.dataType.value === 'forecast') {
            const date = moment(this.formZones.controls.date.value).format('YYYY-MM-DD');
            postIds = ZonesPosts.join(',');
            this.predictionService.getLastForPosts(postIds, date).subscribe((res) => {
              if (res.response) {
                console.log(res.response);
                const forecasts = res.response;
                for (const forecast of forecasts) {
                  if (forecast) {
                    const zoneElement: ZoneData = {postId: 0, value: 0};
                    if (forecast.results.length > 0) {
                      zoneElement.postId = forecast.post_id;
                      zoneElement.value = forecast.results[0].forecast_value;
                      zonesData.push(zoneElement);
                    }
                  }
                }
                console.log(zonesData);
                this.setZones(zonesData);
                this.resetZones();
                console.log(this.resultZones);
                this.markers.push(new GeoJSON(this.resultDangerZones, this.featureStyleDangerZones));
                this.markers.push(new GeoJSON(this.resultZones, this.featureStyleWaterLevel));
              }
            });

          }
        }
    } else {
      this.formError = 'Дата является обязательным полем';
      setTimeout(() => {
        this.formError = '';
      }, 7000);
    }
  }

  resetZones(): void {
    this.markers = this.originalMarkers.slice();
  }

  closeZones(): void {
    this.resetZones();
    this.isZoneFormOpen = false;
  }

  openZones(): void {
    this.isZoneFormOpen = true;
  }

  openLegend(): void {
    this.isLegendOpen = true;
  }

  closeLegend(): void {
    this.isLegendOpen = false;
  }
}
