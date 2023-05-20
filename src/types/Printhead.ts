import { PrintPosition } from "./PrintPosition";
import {emptyNeedle, Needle} from "./Needle";
import {PrintheadTool,emptyPrintheadTool} from "./PrintheadTool";

export interface Printhead {
  index: number;
  tool: PrintheadTool;
  toolPosition: number;
  description: string;
  color: string;
  active: boolean;
  printPositions: PrintPosition[];
  toScale: boolean;
  printPositionSizeMM: number;
  buttonWidthPX: number;
  pickerWell: {sizeMM: number};
  needle: Needle;
  elementType: 'PrintHead';
  temperature: number;
}

export function emptyPrinthead(): Printhead {
  return {
    index: -1,
    tool: emptyPrintheadTool(),
    toolPosition: 1,
    description: '',
    color: '#FFFFFF',
    active: true,
    printPositions: [],
    toScale: true,
    printPositionSizeMM: 0,
    buttonWidthPX: 0,
    pickerWell: {sizeMM: 0},
    needle: emptyNeedle(),
    elementType: 'PrintHead',
    temperature: 0,
  }
}
