import { BehaviorSubject } from 'rxjs';
import {Injectable} from "@angular/core";
import { Coordinates } from "../types/Coordinates";
import { ScreenUtils } from "./screen-utils";
import { Well } from "../types/Well";
import { PrintHead } from "../types/PrintHead";
import { PrintHeadButton } from "../types/PrintHeadButton";

@Injectable({
  providedIn: 'root',
})
export class PrintPositionService {
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

  generatePrintPositionButtons() {
    return {};
  }
  repopulatePrintPositionButtons(well_size: number, printHead?: PrintHead, well?: Well) {
    if (printHead) {
      const ratio = 1 / (well_size / printHead.pickerWell.sizeMM);
      const printPositionsMM = this.getPrintPositionCoordinates(this.PRINT_POSITIONS_COUNT - 1, this.printPickerSizeMM, ratio * this.PRINT_POSITION_SIZE_MM);
      const printPositionsPX = printPositionsMM.map(position => {
        return {
          x: this.toPX(position.x),
          y: this.toPX(position.y)
        };
      });

      printHead.printPositionButtons = printHead.printPositionButtons.map((button, index) => {

        const state = button.selected;
        const buttonStyle = this.getPrintPositionButtonStyle(printHead, index, well_size, 'printhead-component',1);

        return {
          printHead: printHead.printHeadIndex,
          position: index,
          selected: state,
          originPX: {x: printPositionsPX[index].x, y: printPositionsPX[index].y},
          originMM: {x: printPositionsMM[index].x, y: printPositionsMM[index].y},
          style: {
            ...buttonStyle
          }
        };
      });

    } else if (well) {

    } else {
      console.error('no printHead or well object sent to repopulatePrintPositionButtons')

    }

  }
  getPrintPositionButtonStyle(printHead: PrintHead, printPosition: number, well_size: number, called_from: string, plateWell_to_pickerWell_ratio:number) {
    const button = printHead.printPositionButtons[printPosition];
    if (!button) {
      console.warn('Button is not defined:', printHead, printPosition);
      return {};
    }

    const originX = button.originPX.x;
    const originY = button.originPX.y;

    let wellDiameterMM = well_size;
    let buttonSizeMM = this.PRINT_POSITION_SIZE_MM;

    const wellRadiusPX = this.toPX(wellDiameterMM / 2);
    const buttonWidthPX = this.toPX(buttonSizeMM);

    let leftPX = button.originPX.x + wellRadiusPX - (buttonWidthPX/2);
    let topPX = button.originPX.y + wellRadiusPX - (buttonWidthPX/2);

    if(called_from == 'printhead-component') {
      buttonSizeMM = this.scale(buttonSizeMM, (1/plateWell_to_pickerWell_ratio));
    } else if (called_from == 'plate-map') {

    }

    const printPositionStates = printHead.printPositionButtons.map(button => button.selected);
    const selected = printPositionStates[printPosition];

    if (called_from == 'plate-map') {
      console.log('button.originPX after: ', button.originPX)
      console.log('button.style after: ', button.style);
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
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  scale(size: number, scalar: number) {
    return size*scalar;
  }
}
