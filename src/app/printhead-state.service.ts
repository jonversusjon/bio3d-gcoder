import { BehaviorSubject } from 'rxjs';
import {Injectable} from "@angular/core";
import { Coordinates } from "../types/Coordinates";
import { ScreenUtils } from "./screen-utils";

export interface PrintHeadButton {
  printHead: number;
  position: number;
  color: string;
  selected: boolean;
  coordinates: Coordinates;
}

export interface PrintHead {
  printHeadIndex: number;
  description: string;
  color: string;
  active: boolean;
  printPositionStates: boolean[];
  printHeadButtons: PrintHeadButton[];
  pickerWell: {size: number};
}

@Injectable({
  providedIn: 'root',
})
export class PrintHeadStateService {
  PRINT_POSITIONS_COUNT = 9;
  PRINT_POSITION_SIZE_MM = 1.3; // size it's displayed in the plate map
  constructor(private screenUtils: ScreenUtils) {}
  private selectedPrintHeadButtonsSubject = new BehaviorSubject<PrintHeadButton[][]>([]);
  selectedPrintHeadButtons: PrintHeadButton[][] = [];
  selectedPrintHeadButtons$ = this.selectedPrintHeadButtonsSubject.asObservable();

  private _printHeads = new BehaviorSubject<PrintHead[]>([]);
  public printHeads$ = this._printHeads.asObservable();
  private _printPickerSize: number = 34.8;

  initializeSelectedPrintHeadButtons(numberOfPrintHeads: number, numberOfPrintPositions: number): void {
    this.selectedPrintHeadButtons = new Array(numberOfPrintHeads).fill(null).map(() => new Array(numberOfPrintPositions).fill(false));
  }
  updateSelectedPrintHeadButtons(printHeadID: number, buttons: PrintHeadButton[]): void {
    this.selectedPrintHeadButtons[printHeadID] = buttons;
    console.log('Emitting event to selectedPrintHeadButtons$');
    this.selectedPrintHeadButtonsSubject.next(this.selectedPrintHeadButtons);
    console.log('Selected printHead buttons:', this.selectedPrintHeadButtons);
  }
  toPX(size_in_mm:number) {
    return this.screenUtils.convertMMToPPI(size_in_mm);
  }
  getPrintPositionButtonStyle(printHead: PrintHead, printPosition: number, well_size: number) {
      const radius = this.toPX(well_size) / 2;
      const buttonSize = this.toPX(this.PRINT_POSITION_SIZE_MM)
      const selected = printHead.printPositionStates[printPosition];
      const button = printHead.printHeadButtons[printPosition];
      return {
        'background-color': selected ? printHead.color : 'transparent',
        'border-color': printHead.active ? printHead.color : 'grey',
        left: `${button.coordinates.x + radius}px`,
        top: `${button.coordinates.y + radius }px`,
        width: `${buttonSize}px`,
        aspectRatio: '1 / 1',
        borderWidth: '1px',
        borderRadius: '50%',
        position: 'absolute',
        padding: '0px',
        margin: '0px'
      };

  }

  public set printPickerSize(size: number) {
    this._printPickerSize = size;
  }

  public get printPickerSize(): number {
    return this._printPickerSize;
  }

  // updateNumberOfPrintheads(newNumberOfPrintheads: number): void {
  //   this.selectedPrintheadButtons.length = newNumberOfPrintheads;
  //   for (let i = 0; i < newNumberOfPrintheads; i++) {
  //     if (!this.selectedPrintheadButtons[i]) {
  //       this.selectedPrintheadButtons[i] = [];
  //     }
  //   }
  // }

  updatePrintHeads(printHeads: PrintHead[]): void {
    this._printHeads.next(printHeads);
  }

}
