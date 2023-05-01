import { PrintPosition } from "./PrintPosition";
import {emptyNeedle, Needle} from "./Needle";
import {Coordinates} from "./Coordinates";

export interface PrintHead {
  printHeadIndex: number;
  description: string;
  color: string;
  active: boolean;
  printPositions: PrintPosition[];
  printPositionSizeMM: number;
  buttonWidthPX: number;
  pickerWell: {sizeMM: number};
  needle: Needle;
  elementType: 'PrintHead';
}

export function emptyPrintHead(): PrintHead {
  return {
    printHeadIndex: -1,
    description: '',
    color: 'white',
    active: true,
    printPositions: [],
    printPositionSizeMM: 0,
    buttonWidthPX: 0,
    pickerWell: {sizeMM: 0},
    needle: emptyNeedle(),
    elementType: 'PrintHead',
  }
}
