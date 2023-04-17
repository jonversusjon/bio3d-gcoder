import {Coordinates} from "./Coordinates";
import {PrintHeadButton} from "./PrintHeadButton";


export interface Well {
  row: number;
  col: number;
  originPX: Coordinates;
  originMM: Coordinates;
  selected: boolean;
  printPositionButtons: PrintHeadButton[];
  style: {
    height: string;
    width: string;
    top: string;
    left: string;
    borderRadius: string;
    border: string;
  };
  element: HTMLElement;
}
