// TODO: need a way to code for the coordinates of the plate map
// TODO: need a way to code for calibrations - well_well_x, well_well_y, a1_center_left_edge, a1_center_top_edge, plate_height, well_depth
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import {Coordinates} from "../types/Coordinates";
import { PrintHeadButton } from "../types/PrintHeadButton";

@Injectable({
  providedIn: 'root',
})
export class PlateFormatService {
  private selectedPlateSource = new BehaviorSubject<any>(null);
  selectedPlate$ = this.selectedPlateSource.asObservable();

  private plateFormats = [
    { name: '6-well plate', 'plateId': 6, rows: 2, cols: 3, well_sizeMM: 34.8, well_spacing_x_MM: 39, well_spacing_y_MM: 39,'a1_centerMM': {x:24.798,y:23.275} },
    { name: '12-well plate','plateId': 12,  rows: 3, cols: 4, well_sizeMM: 22.1, well_spacing_x_MM: 26, well_spacing_y_MM: 26, 'a1_centerMM': {x:24.75,y:16.68} },
    { name: '24-well plate','plateId': 24,  rows: 4, cols: 6, well_sizeMM: 15.6, well_spacing_x_MM: 19.3, well_spacing_y_MM: 19.3, 'a1_centerMM': {x:15.12,y:13.49} },
    { name: '48-well plate','plateId': 48,  rows: 6, cols: 8, well_sizeMM: 11.37, well_spacing_x_MM: 13.0, well_spacing_y_MM: 13.0, 'a1_centerMM': {x:18.38,y:10.24} },
    { name: '96-well plate', 'plateId': 96, rows: 8, cols: 12, well_sizeMM: 6.96, well_spacing_x_MM: 9, well_spacing_y_MM: 9, 'a1_centerMM': {x:14.38,y:11.24} },
    { name: '384-well plate', 'plateId': 384, rows: 12, cols: 24, well_sizeMM: 3.3, well_spacing_x_MM: 4.5, well_spacing_y_MM: 4.5, 'a1_centerMM': {x:12.13,y:8.99} }
  ];


  constructor() {

  }

  getPlateFormats() {
    return this.plateFormats;
  }

  getDefaultPlateFormat() {
    return this.plateFormats[0];
  }
  setSelectedPlate(plate: any) {
    this.selectedPlateSource.next(plate);
  }

  getWellOrigins(startingX: number, startingY: number, rows: number, cols: number, spacingX: number, spacingY: number): { x: number, y: number }[][] {
    const coordinates: { x: number, y: number }[][] = [];

    for (let i = 0; i < rows; i++) {
      const rowCoordinates: { x: number, y: number }[] = [];
      for (let j = 0; j < cols; j++) {
        const x = startingX + j * spacingX;
        const y = startingY + i * spacingY;
        rowCoordinates.push({ x, y });
      }
      coordinates.push(rowCoordinates);
    }

    return coordinates;
  }


}

