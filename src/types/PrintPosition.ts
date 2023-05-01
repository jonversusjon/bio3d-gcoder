import {Coordinates, emptyCoordinates} from "./Coordinates";

export interface PrintPosition {
  parentIndex: number;
  index: number;
  selected: boolean;
  button: {
    widthPX: number;
    color: string;
  };
  originMM_display: Coordinates;
  originMM_absolute: Coordinates;
  elementType: string;
}

export function emptyPrintPosition(): PrintPosition {
  return {
    parentIndex: -1,
    index: -1,
    selected: false,
    button: {
      widthPX: 0,
      color: 'white',
    },
    originMM_display: emptyCoordinates(),
    originMM_absolute: emptyCoordinates(),
    elementType: 'PrintHeadButton'
  }
}
