import { BehaviorSubject } from 'rxjs';
import {Injectable} from "@angular/core";
import { Coordinates } from "../types/Coordinates";
import { ScreenUtils } from "./screen-utils";

export interface PrintHeadButton {
  printHead: number;
  position: number;
  style: {};
  selected: boolean;
  originMM: Coordinates;
  originPX: Coordinates;
}

export interface PrintHead {
  printHeadIndex: number;
  description: string;
  color: string;
  active: boolean;
  printPositionStates: boolean[];
  printHeadButtons: PrintHeadButton[];
  pickerWell: {sizeMM: number};
}

@Injectable({
  providedIn: 'root',
})
export class PrintHeadStateService {
  PRINT_POSITIONS_COUNT = 9;
  PRINT_POSITION_SIZE_MM = 1.1; // size it's displayed in the plate map
  constructor(private screenUtils: ScreenUtils) {}
  private selectedPrintHeadButtonsSubject = new BehaviorSubject<PrintHeadButton[][]>([]);
  selectedPrintHeadButtons: PrintHeadButton[][] = [];
  selectedPrintHeadButtons$ = this.selectedPrintHeadButtonsSubject.asObservable();

  private _printHeads = new BehaviorSubject<PrintHead[]>([]);
  public printHeads$ = this._printHeads.asObservable();
  private _printPickerSizeMM: number = 34.8;

  initializeSelectedPrintHeadButtons(numberOfPrintHeads: number, numberOfPrintPositions: number): void {
    this.selectedPrintHeadButtons = new Array(numberOfPrintHeads).fill(null).map(() => new Array(numberOfPrintPositions).fill(false));
  }
  updateSelectedPrintHeadButtons(printHeadID: number, buttons: PrintHeadButton[]): void {
    this.selectedPrintHeadButtons[printHeadID] = buttons;
    console.log('Emitting event to selectedPrintHeadButtons$');
    this.selectedPrintHeadButtonsSubject.next(this.selectedPrintHeadButtons);
    console.log('Selected printHead buttons:', this.selectedPrintHeadButtons);
  }

  getPrintPositionButtonStyle(printHead: PrintHead, printPosition: number, well_size: number, called_from: string, plateWell_to_pickerWell_ratio:number) {

    let wellDiameterMM = well_size;
    let buttonSizeMM = this.PRINT_POSITION_SIZE_MM;

    if(called_from == 'printhead-setup') {
      // console.log('buttonSizeMM before: ', buttonSizeMM);
      buttonSizeMM = this.scale(buttonSizeMM, (1/plateWell_to_pickerWell_ratio));
      // console.log('buttonSizeMM after: ', buttonSizeMM);
    } else {
      buttonSizeMM = this.scale(buttonSizeMM, plateWell_to_pickerWell_ratio);
    }

    const selected = printHead.printPositionStates[printPosition];
    const button = printHead.printHeadButtons[printPosition];
    if(called_from == "plate-map") {
      console.log('button[', printPosition, ']: ', JSON.stringify(button));
    }

    if (!button) {
      console.warn('Button is not defined:', printHead, printPosition);
      return {};
    }

    const wellRadiusPX = this.toPX(wellDiameterMM / 2);
    if(called_from == 'plate-map') {
      console.log('button.originPX.x: ', button.originPX.x);
      console.log('button.originPX.y: ', button.originPX.y);
      console.log('wellRadiusPX: ', wellRadiusPX);
    }
    const buttonWidthPX = this.toPX(buttonSizeMM);
    const leftPX = button.originPX.x + wellRadiusPX - (buttonWidthPX/2);
    const topPX = button.originPX.y + wellRadiusPX - (buttonWidthPX/2);

    if(called_from !== 'plate-map') {
      if (printPosition == 0) {
        // console.log('wellRadiusPX: ', wellRadiusPX);
        // console.log('widthPX: ', buttonWidthPX);
        console.log('width: ', this.toPX(buttonSizeMM));
        console.log('leftPX: ', leftPX);
        console.log('topPX: ', topPX);

        // console.log('wellRadiusPX: ', wellRadiusPX);
        // console.log('ratio: ', ratio);
      }
    }

    return {
        'background-color': selected ? printHead.color : 'transparent',
        'border-color': printHead.active ? printHead.color : 'grey',
        left: `${(leftPX)}px`,
        top: `${(topPX)}px`,
        width: `${(buttonWidthPX)}px`,
        aspectRatio: '1 / 1',
        borderWidth: '1px',
        borderRadius: '50%',
        position: 'absolute',
        padding: '0px',
        margin: '0px'
      };

  }

  getPrintPositionCoordinates(numDots: number, wellSize:number, dotSize:number, adj_x= 0, adj_y= 0) {
    const radius = (0.8 * wellSize ) / 2;
    const angles = Array.from({length: numDots}, (_, i) => i / numDots * 2 * Math.PI);

    const x = angles.map(angle => radius * Math.cos(angle));
    const y = angles.map(angle => radius * Math.sin(angle));

    let printPositionCoordinates: Coordinates[] = [{ x: - (dotSize/2) + adj_x, y: - (dotSize/2) + adj_y, label: "0" }];
    for (let i = 0; i < numDots; i++) {
      printPositionCoordinates.push({'x': (x[i] - (dotSize/2) + adj_x), 'y': (y[i] - (dotSize/2) + adj_y)});
    }

    return printPositionCoordinates;
  }
  public set printPickerSizeMM(size: number) {
    this._printPickerSizeMM = size;
  }

  public get printPickerSizeMM(): number {
    return this._printPickerSizeMM;
  }

  updatePrintHeads(printHeads: PrintHead[]): void {
    this._printHeads.next(printHeads);
  }
  toPX(size_in_mm:number) {
    return this.screenUtils.convertMMToPPI(size_in_mm);
  }

  scale(size: number, scalar: number) {
    return size*scalar;
  }
}
