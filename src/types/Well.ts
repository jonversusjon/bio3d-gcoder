import {Coordinates, emptyCoordinates} from "./Coordinates";
import {PrintPosition} from "./PrintPosition";


export interface Well {
  row: number;
  col: number;
  originPX: Coordinates;
  originMM: Coordinates;
  selected: boolean;
  printPositionButtons: PrintPosition[];
  style: {
    height: string;
    width: string;
    top: string;
    left: string;
    borderRadius: string;
    border: string;
  };
  elementType: 'Well';
  element: HTMLElement;
}

export function emptyWell(): Well {
  return {
    row: 0,
    col: 0,
    originPX: emptyCoordinates(),
    originMM: emptyCoordinates(),
    selected: false,
    printPositionButtons: [],
    style: {
      height: '0px',
      width: '0px',
      top: '0px',
      left: '0px',
      borderRadius: '50%',
      border: '1px solid black',
    },
    elementType: 'Well',
    element: document.createElement('div'),
  }
}
