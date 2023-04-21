import { PrintHeadButton } from "./PrintHeadButton";
import {Needle} from "./Needle";

export interface PrintHead {
  printHeadIndex: number;
  description: string;
  color: string;
  active: boolean;
  printPositionButtons: PrintHeadButton[];
  printPositionSizeMM: number;
  buttonWidthMM: number;
  pickerWell: {sizeMM: number};
  needle: Needle;
  elementType: 'PrintHead';
}
