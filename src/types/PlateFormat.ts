import {Coordinates} from "./Coordinates";

export interface PlateFormat {
  name: string;
  plateId: number;
  rows: number;
  cols: number;
  well_size: number;
  well_spacing: number;
  a1_center: Coordinates;
}
