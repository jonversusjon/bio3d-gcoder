import {Coordinates} from "./Coordinates";

export interface PrintHeadButton {
  printHead: number;
  position: number;
  style: {};
  selected: boolean;
  originMM: Coordinates;
  originPX: Coordinates;
}
