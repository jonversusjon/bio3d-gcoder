import {Well} from "./Well";

export interface PlateMap {
  wells: Well[][];
  columnHeaders: any[];
  rowHeaders: any[]
}

export function emptyPlateMap(): PlateMap {
  return {
    wells: [],
    columnHeaders: [],
    rowHeaders: []
  }
}
