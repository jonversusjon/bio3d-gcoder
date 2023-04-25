// TODO: need a way to code for the coordinates of the plate map
// TODO: need a way to code for calibrations - well_well_x, well_well_y, a1_center_left_edge, a1_center_top_edge, plate_height, well_depth
import { Injectable, ApplicationRef } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {PlateFormat} from "../../types/PlateFormat";

@Injectable({
  providedIn: 'root',
})
export class PlateFormatService {

  private plateFormats = [
    { name: '6-well plate',
      'plateId': 6,
      rows: 2,
      cols: 3,
      well_sizeMM: 34.8,
      well_spacing_x_MM: 39.12,
      well_spacing_y_MM: 39.12,
      'a1_centerMM': {x:24.798,y:23.275},
      well_bottom_thicknessMM: 1.27,
      well_depth_MM: 16.5
    },
    { name: '12-well plate',
      'plateId': 12,
      rows: 3,
      cols: 4,
      well_sizeMM: 22.1,
      well_spacing_x_MM: 26,
      well_spacing_y_MM: 26,
      'a1_centerMM': {x:24.75,y:16.68},
      well_bottom_thicknessMM: 1.27,
      well_depth_MM: 16.5
    },
    { name: '24-well plate',
      'plateId': 24,
      rows: 4,
      cols: 6,
      well_sizeMM: 15.6,
      well_spacing_x_MM: 19.3,
      well_spacing_y_MM: 19.3,
      'a1_centerMM': {x:15.12,y:13.49},
      well_bottom_thicknessMM: 1.27,
      well_depth_MM: 16.5
    },
    { name: '48-well plate',
      'plateId': 48,
      rows: 6,
      cols: 8,
      well_sizeMM: 11.37,
      well_spacing_x_MM: 13.0,
      well_spacing_y_MM: 13.0,
      'a1_centerMM': {x:18.38,y:10.24},
      well_bottom_thicknessMM: 1.27,
      well_depth_MM: 16.5
    },
    { name: '96-well plate',
      'plateId': 96,
      rows: 8,
      cols: 12,
      well_sizeMM: 6.96,
      well_spacing_x_MM: 9,
      well_spacing_y_MM: 9,
      'a1_centerMM': {x:14.38,y:11.24},
      well_bottom_thicknessMM: 1.27,
      well_depth_MM: 10.9
    }
  ];

  private _selectedPlateSubject = new Subject<PlateFormat | null>();
  selectedPlate$ = this._selectedPlateSubject.asObservable();
  private _latestSelectedPlate: PlateFormat | null = null;

  constructor(private appRef: ApplicationRef) {

  }

  getPlateFormats() {
    return this.plateFormats;
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

  setSelectedPlate(plate: PlateFormat ) {
    if(plate) {
      this._latestSelectedPlate = plate;
      this._selectedPlateSubject.next(plate);
    }
  }

  getLatestSelectedPlate(): PlateFormat | null {
    return this._latestSelectedPlate;
  }

}

