import {Coordinates, emptyCoordinates} from "./Coordinates";

export interface PlateFormat {
  name: string;
  plateId: number;
  rows: number;
  cols: number;
  well_sizeMM: number;
  well_spacing_x_MM: number;
  well_spacing_y_MM: number;
  a1_centerMM: Coordinates;
  elementType: 'PlateFormat';
  printPositionSizeMM: number;
  well_bottom_thicknessMM: number;
  well_depth_MM: number;
}

export function emptyPlateFormat(): PlateFormat {
  return {
    name: '',
    plateId: -1,
    rows: 0,
    cols: 0,
    well_sizeMM: 0,
    well_spacing_x_MM: 0,
    well_spacing_y_MM: 0,
    a1_centerMM: emptyCoordinates(),
    elementType: 'PlateFormat',
    printPositionSizeMM: 0,
    well_bottom_thicknessMM: 0,
    well_depth_MM: 0,
  }
}
