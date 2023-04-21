import {Coordinates} from "./Coordinates";

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
}
