import * as L from 'leaflet';

export class CustomMarker extends L.Marker {
  data: any;

  constructor(latLng: L.LatLngExpression, data: any, options?: L.MarkerOptions) {
    super(latLng, options);
    this.setData(data);
  }

  getData(): void {
    return this.data;
  }

  setData(data: any): void {
    this.data = data;
  }
}
