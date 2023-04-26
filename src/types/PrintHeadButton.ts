import {Coordinates, emptyCoordinates} from "./Coordinates";

export interface PrintHeadButton {
  printHead: number;
  position: number;
  style: {};
  selected: boolean;
  originMM: Coordinates;
  originPX: Coordinates;
}

export function emptyPrintHeadButton(): PrintHeadButton {
  return {
    printHead: -1,
    position: -1,
    style: {},
    selected: false,
    originMM: emptyCoordinates(),
    originPX: emptyCoordinates(),
  }
}
