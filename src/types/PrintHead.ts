import { PrintPosition } from "./PrintPosition";
import {emptyNeedle, Needle} from "./Needle";
import {Coordinates} from "./Coordinates";
import {PrintHeadBehavior, emptyPrintHeadBehavior} from "./PrintHeadBehavior";

export interface PrintHead {
  index: number;
  printHeadBehavior: PrintHeadBehavior;
  description: string;
  color: string;
  active: boolean;
  printPositions: PrintPosition[];
  printPositionSizeMM: number;
  buttonWidthPX: number;
  pickerWell: {sizeMM: number};
  needle: Needle;
  elementType: 'PrintHead';
  temperature: number;
}

export function emptyPrintHead(): PrintHead {
  return {
    index: -1,
    printHeadBehavior: emptyPrintHeadBehavior(),
    description: '',
    color: '#FFFFFF',
    active: true,
    printPositions: [],
    printPositionSizeMM: 0,
    buttonWidthPX: 0,
    pickerWell: {sizeMM: 0},
    needle: emptyNeedle(),
    elementType: 'PrintHead',
    temperature: 0,
  }
}
