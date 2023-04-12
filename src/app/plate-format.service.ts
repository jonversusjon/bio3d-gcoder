import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlateFormatService {
  private selectedPlateSource = new BehaviorSubject<any>(null);
  selectedPlate$ = this.selectedPlateSource.asObservable();

  private plateFormats = [
      { name: '6-well plate', 'plateId': 6, rows: 2, cols: 3, well_size: 34.8, well_spacing: 39,'a1_center': {x:24.798,y:23.275} },
      { name: '12-well plate','plateId': 12,  rows: 3, cols: 4, well_size: 22.1, well_spacing: 26, 'a1_center': {x:24.75,y:16.68} },
      { name: '24-well plate','plateId': 24,  rows: 4, cols: 6, well_size: 15.6, well_spacing: 19.3, 'a1_center': {x:15.12,y:13.49} },
      { name: '48-well plate','plateId': 48,  rows: 6, cols: 8, well_size: 11.37, well_spacing: 13.0, 'a1_center': {x:18.38,y:10.24} },
      { name: '96-well plate', 'plateId': 96, rows: 8, cols: 12, well_size: 6.96, well_spacing: 9, 'a1_center': {x:14.38,y:11.24} },
      { name: '384-well plate', 'plateId': 384, rows: 12, cols: 24, well_size: 3.3, well_spacing: 4.5, 'a1_center': {x:12.13,y:8.99} }
    ];

  constructor() {}

  getPlateFormats() {
    return this.plateFormats;
  }

  getDefaultPlateFormat() {
    return this.plateFormats[0];
  }
  setSelectedPlate(plate: any) {
    this.selectedPlateSource.next(plate);
  }
}

