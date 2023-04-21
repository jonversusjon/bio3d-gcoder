import { PrintHeadButton } from "./PrintHeadButton";

export interface PrintHead {
  printHeadIndex: number;
  description: string;
  color: string;
  active: boolean;
  printPositionButtons: PrintHeadButton[];
  pickerWell: {sizeMM: number};
  elementType: 'PrintHead';
}
