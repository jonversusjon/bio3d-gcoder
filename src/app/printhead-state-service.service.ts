import { BehaviorSubject } from 'rxjs';
import {Injectable} from "@angular/core";
import { Coordinates } from "../types/Coordinates";

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
  private selectedPrintheadButtonsSubject = new BehaviorSubject<PrintHeadButton[][]>([]);
  selectedPrintheadButtons: PrintHeadButton[][] = [];
  selectedPrintheadButtons$ = this.selectedPrintheadButtonsSubject.asObservable();

  private _printHeads = new BehaviorSubject<PrintHead[]>([]);
  public printHeads$ = this._printHeads.asObservable();
  private _printPickerSize: number = 34.8;

  initializeSelectedPrintheadButtons(numberOfPrintheads: number): void {
    this.selectedPrintheadButtons = new Array(numberOfPrintheads).fill(null).map(() => []);
  }
  updateSelectedPrintheadButtons(printheadID: number, buttons: PrintHeadButton[]): void {
    this.selectedPrintheadButtons[printheadID] = buttons;
    console.log('Emitting event to selectedPrintheadButtons$');
    this.selectedPrintheadButtonsSubject.next(this.selectedPrintheadButtons);
    console.log('Selected printhead buttons:', this.selectedPrintheadButtons);
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
