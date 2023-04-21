import { BehaviorSubject } from 'rxjs';
import {Injectable} from "@angular/core";
import { Coordinates } from "../types/Coordinates";
import { ScreenUtils } from "./screen-utils";
import { PrintHead } from "../types/PrintHead";
import { PrintHeadButton } from "../types/PrintHeadButton";
import {PlateFormat} from "../types/PlateFormat";
import {Well} from "../types/Well";

@Injectable({
  providedIn: 'root',
})

export class PrintPositionService {
  PRINT_POSITIONS_COUNT = 9;
  PRINT_POSITION_SIZE_MM = 4; // size it's displayed in the plate map
  private printPositionAngles = Array.from({length: this.PRINT_POSITIONS_COUNT - 1}, (_, i) => i / (this.PRINT_POSITIONS_COUNT - 1) * 2 * Math.PI);
  private printPositionCoordinates: Coordinates[] = [];
  private _printPositionCoordinates = new BehaviorSubject<Coordinates[]>([]);
  public printPositionCoordinates$ = this._printPositionCoordinates.asObservable();
  constructor(private screenUtils: ScreenUtils) {
    this.selectedPlate$.subscribe((plate) => {
      this.onSelectedPlateChange(plate);
    });
  }

  private selectedPrintHeadButtonsSubject = new BehaviorSubject<PrintHeadButton[][]>([]);
  selectedPrintHeadButtons: PrintHeadButton[][] = [];
  selectedPrintHeadButtons$ = this.selectedPrintHeadButtonsSubject.asObservable();

  private _printHeads = new BehaviorSubject<PrintHead[]>([]);
  public printHeads$ = this._printHeads.asObservable();
  private _printPickerSizeMM: number = 34.8;

  private _selectedPlate = new BehaviorSubject<PlateFormat | null>(null);
  selectedPlate$ = this._selectedPlate.asObservable();

  onSelectedPlateChange(plate: PlateFormat | null) {
    if (plate) {
      this.printPositionCoordinates = this.getPrintPositionCoordinates('Well', this.PRINT_POSITION_SIZE_MM);
      this._printPositionCoordinates.next(this.printPositionCoordinates);
    } else {
      this.printPositionCoordinates = [];
    }
  }

  updateSelectedPrintHeadButtons(printHeadID: number, buttons: PrintHeadButton[]): void {
    this.selectedPrintHeadButtons[printHeadID] = buttons;
    console.log('Emitting event to selectedPrintHeadButtons$');
    this.selectedPrintHeadButtonsSubject.next(this.selectedPrintHeadButtons);
    console.log('Selected printHead buttons:', this.selectedPrintHeadButtons);
  }

  getButtonWidthMM() {
    const buttonWidth = this.PRINT_POSITION_SIZE_MM / ((this.selectedPlate?.well_sizeMM ? this.selectedPlate.well_sizeMM : 1) / this.printPickerSizeMM);
    return buttonWidth;
  }

  getButtonLeftMM(parentElement: PrintHead | Well, buttonPosition: number) {
    const parentType = parentElement.elementType;
    const coordinates = this.getPrintPositionCoordinates(parentType, this.PRINT_POSITION_SIZE_MM);
    if(coordinates[buttonPosition]) {
      return coordinates[buttonPosition].x;
    } else {
      return 0;
    }
  }

  getButtonTopMM(parentElement: PrintHead | Well, buttonPosition: number) {
    const parentType = parentElement.elementType;
    const coordinates = this.getPrintPositionCoordinates(parentType, this.PRINT_POSITION_SIZE_MM);
    if(coordinates[buttonPosition]) {
      return coordinates[buttonPosition].y;
    } else {
      return 0;
    }
  }

  getPrintPositionCoordinates(parentType: 'PrintHead' | 'Well', dotSizeMM:number, adj_x= 0, adj_y= 0) {
    const wellSizeMM = parentType === 'PrintHead' ? this._printPickerSizeMM : this.selectedPlate?.well_sizeMM || 1;
    const radiusMM = (0.8 * wellSizeMM ) / 2;
    const centerX_MM = wellSizeMM / 2;
    const centerY_MM = wellSizeMM / 2;

    const rawCoords: Coordinates[] = this.printPositionAngles.map(angle => ({
      x: centerX_MM + radiusMM * Math.cos(angle),
      y: centerY_MM + radiusMM * Math.sin(angle)
    }));

    let printPositionCoordinates: Coordinates[] = [{ x: centerX_MM - (dotSizeMM/2) + adj_x, y: centerY_MM - (dotSizeMM/2) + adj_y, label: "0" }];
    for (let i = 0; i < this.PRINT_POSITIONS_COUNT - 1; i++) {
      printPositionCoordinates.push({'x': (rawCoords[i].x - (dotSizeMM/2) + adj_x), 'y': (rawCoords[i].y - (dotSizeMM/2) + adj_y)});
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

  setSelectedPlate(plate: PlateFormat) {
    console.log('printPositionService sets the next plate');
    this._selectedPlate.next(plate);
  }

  get selectedPlate(): PlateFormat | null {
    return this._selectedPlate.getValue();
  }
}
