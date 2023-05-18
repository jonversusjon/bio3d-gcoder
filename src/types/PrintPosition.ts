import {Coordinates, emptyCoordinates} from "./Coordinates";

export interface PrintPosition {
  parentIndex: number;
  index: number;
  selected: boolean;
  button: {
    widthMM: number;
    widthPCT: number;
    color: string;
  };
  originMM_display: Coordinates;
  originMM_absolute: Coordinates;
  originPCT_display: Coordinates;
  elementType: string;
}

export function emptyPrintPosition(): PrintPosition {
  return {
    parentIndex: -1,
    index: -1,
    selected: false,
    button: {
      widthMM: 0,
      widthPCT: 0,
      color: '#FFFFFF',
    },
    originMM_display: emptyCoordinates(),
    originMM_absolute: emptyCoordinates(),
    originPCT_display: emptyCoordinates(),
    elementType: 'PrintHeadButton'
  }
}
