import { PrintHeadButton } from "./PrintHeadButton";
import {emptyNeedle, Needle} from "./Needle";

export interface PrintHead {
  printHeadIndex: number;
  description: string;
  color: string;
  active: boolean;
  printPositionButtons: PrintHeadButton[];
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
    printPositionButtons: [],
    printPositionSizeMM: 0,
    buttonWidthPX: 0,
    pickerWell: {sizeMM: 0},
    needle: emptyNeedle(),
    elementType: 'PrintHead',
  }
}
