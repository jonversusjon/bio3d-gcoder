import {Coordinates, emptyCoordinates} from "./Coordinates";

export interface PrintHeadButton {
  printHead: number;
  position: number;
  selected: boolean;
  topPX: number;
  leftPX: number;
  widthPX: number;
  color: string;
  originMM: Coordinates;
  originPX: Coordinates;
}

export function emptyPrintHeadButton(): PrintHeadButton {
  return {
    printHead: -1,
    position: -1,
    selected: false,
    topPX: 0,
    leftPX: 0,
    widthPX: 0,
    color: 'white',
    originMM: emptyCoordinates(),
    originPX: emptyCoordinates(),
  }
}
