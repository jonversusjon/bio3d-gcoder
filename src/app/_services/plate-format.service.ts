// TODO: need a way to code for the coordinates of the plate map
// TODO: need a way to code for calibrations - well_well_x, well_well_y, a1_center_left_edge, a1_center_top_edge, plate_height, well_depth
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {emptyPlateFormat, PlateFormat} from "../../types/PlateFormat";
import {Coordinates} from "../../types/Coordinates";
import {DataAggregatorService} from "./data-aggregator.service";

@Injectable({
  providedIn: 'root',
})
export class PlateFormatService {
  public plateFormats:PlateFormat[] = [
    { name: '6-well plate',
      'plateId': 6,
      rows: 2,
      cols: 3,
      well_sizeMM: 34.8,
      well_pitch_x_MM: 39.12,
      well_pitch_y_MM: 39.12,
      'a1_centerMM': {x:24.798,y:23.275},
      elementType: 'PlateFormat',
      printPositionSizeMM: 0,
      well_bottom_thicknessMM: 1.27,
      well_depth_MM: 16.5,
      widthMM: 85.4,
      lengthMM: 127.6,
    },
    { name: '12-well plate',
      'plateId': 12,
      rows: 3,
      cols: 4,
      well_sizeMM: 22.1,
      well_pitch_x_MM: 26,
      well_pitch_y_MM: 26,
      'a1_centerMM': {x:24.75,y:16.68},
      elementType: 'PlateFormat',
      printPositionSizeMM: 0,
      well_bottom_thicknessMM: 1.27,
      well_depth_MM: 16.5,
      widthMM: 85.4,
      lengthMM: 127.6,
    },
    { name: '24-well plate',
      'plateId': 24,
      rows: 4,
      cols: 6,
      well_sizeMM: 15.6,
      well_pitch_x_MM: 19.3,
      well_pitch_y_MM: 19.3,
      'a1_centerMM': {x:15.12,y:13.49},
      elementType: 'PlateFormat',
      printPositionSizeMM: 0,
      well_bottom_thicknessMM: 1.27,
      well_depth_MM: 16.5,
      widthMM: 85.4,
      lengthMM: 127.6,
    },
    { name: '48-well plate',
      'plateId': 48,
      rows: 6,
      cols: 8,
      well_sizeMM: 11.37,
      well_pitch_x_MM: 13.0,
      well_pitch_y_MM: 13.0,
      'a1_centerMM': {x:18.38,y:10.24},
      elementType: 'PlateFormat',
      printPositionSizeMM: 0,
      well_bottom_thicknessMM: 1.27,
      well_depth_MM: 16.5,
      widthMM: 85.4,
      lengthMM: 127.6,
    },
    { name: '96-well plate',
      'plateId': 96,
      rows: 8,
      cols: 12,
      well_sizeMM: 6.96,
      well_pitch_x_MM: 9,
      well_pitch_y_MM: 9,
      'a1_centerMM': {x:14.38,y:11.24},
      elementType: 'PlateFormat',
      printPositionSizeMM: 0,
      well_bottom_thicknessMM: 1.27,
      well_depth_MM: 10.9,
      widthMM: 85.4,
      lengthMM: 127.6,
    }
  ];
  public plateOrigins: { description: string,
  value: string}[] = [
    {description: "Plate center", value:"plate-center"},
    {description: "Top-left corner", value:"top-left"},
    {description: "Bottom-left corner", value:"bottom-left"},
    {description: "Top-right corner", value:"top-right"},
    {description: "Bottom-right corner", value:"bottom-right"}
  ]

  public plateHeight = 85.4;
  public plateWidth = 127.6;
  public originMarkerSizeMM = 12;

  private _selectedPlateSubject = new Subject<PlateFormat>();
  selectedPlate$ = this._selectedPlateSubject.asObservable();
  private _latestSelectedPlate: PlateFormat = emptyPlateFormat();

  printPositionCoordinates:Coordinates[][] = [];

  constructor() {
  }

  getPlateFormats() {
    return this.plateFormats;
  }

  getWellOrigins(startingX: number, startingY: number, rows: number, cols: number, spacingX: number, spacingY: number): Coordinates[][] {
    const coordinates: Coordinates[][] = [];

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
      console.log('setting next plate');
      this._selectedPlateSubject.next(plate);
    }
  }

  getLatestSelectedPlate(): PlateFormat | null {
    return this._latestSelectedPlate;
  }

}

