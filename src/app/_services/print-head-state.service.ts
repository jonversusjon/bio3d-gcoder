import {BehaviorSubject} from 'rxjs';
import {Injectable, EventEmitter} from "@angular/core";
import { Coordinates } from "../../types/Coordinates";
import { ScreenUtils } from "./screen-utils";
import { PrintHead } from "../../types/PrintHead";
import { PlateFormat } from "../../types/PlateFormat";
import { Needle } from "../../types/Needle";
import { PlateFormatService } from "./plate-format.service";
import {PrintHeadButton} from "../../types/PrintHeadButton";

@Injectable({
  providedIn: 'root',
})

export class PrintHeadStateService {
  printPositionSelectionChanged = new EventEmitter<void>();

  printHeads: PrintHead[] = [];
  printHeadButtons: PrintHeadButton[] = [];
  numberOfPrintHeads: number = 1;

  PRINT_POSITIONS_COUNT = 9;
  private printPositionAngles = Array.from({length: this.PRINT_POSITIONS_COUNT - 1}, (_, i) => i / (this.PRINT_POSITIONS_COUNT - 1) * 2 * Math.PI);
  private printPositionCoordinates: Coordinates[] = [];
  private _printPositionCoordinates = new BehaviorSubject<Coordinates[]>([]);
  public printPositionCoordinates$ = this._printPositionCoordinates.asObservable();

  private _selectedPlate!: PlateFormat;
  private colors: string[] = [
    '#009ADE',
    '#FF1F5B',
    '#00CD6C',
    '#FFC61E',
    '#AF58BA',
    '#F28522',
  ];

  constructor(private screenUtils: ScreenUtils,
              private plateFormatService: PlateFormatService) {
    this.plateFormatService.selectedPlate$.subscribe((plate) => {
      this.onSelectedPlateChange(plate);
    });
  }

  private _printHeads = new BehaviorSubject<PrintHead[]>([]);
  public printHeads$ = this._printHeads.asObservable();
  private _printPickerSizeMM: number = 34.8;

  public needles:Needle[] = [
    {name: '27ga', odMM: 0.42, color: 'white'},
    {name: '25ga', odMM: 0.53, color: 'red'},
    {name: '23ga', odMM: 0.63, color: 'orange'},
    {name: '22ga', odMM: 0.70, color: 'blue'},
    {name: '21ga', odMM: 0.83, color: 'purple'},
    {name: '20ga', odMM: 0.91, color: 'pink'},
    {name: '18ga', odMM: 1.27, color: 'green'},
    {name: '16ga', odMM: 1.63, color: 'grey'},
    {name: '15ga', odMM: 1.65, color: 'amber'},
    {name: '14ga', odMM: 1.83, color: 'olive'}
  ];

  onSelectedPlateChange(plate: PlateFormat | null) {
    console.log('print head state service says plate was changed');
    if (plate) {
      this.printPositionCoordinates = this.getPrintPositionCoordinates('Well', plate.printPositionSizeMM);
      this._printPositionCoordinates.next(this.printPositionCoordinates);
    } else {
      this.printPositionCoordinates = [];
    }
  }

  onPrintHeadsUpdate(printHeads: PrintHead[] | null) {

  }

  updatePrintHeadButtons(printHead: PrintHead, buttonIndex?: number, updateAll: boolean = false) {
    if (updateAll) {
      this.updateAllPrintHeadButtons(printHead);
    } else if (buttonIndex !== undefined) {
      this.toggleButton(printHead, printHead.printPositionButtons[buttonIndex]);
    }
    this.updatePrintHeadButtons(printHead);
  }

  updateAllPrintHeadButtons(printHead: PrintHead) {
    if (!printHead.active) {
      this.setAllButtonsInactive(printHead);
    } else {
      // if (this.selectedPlate) { // Add this check
      // this.printPositionService.repopulatePrintPositionButtons(this.selectedPlate.well_sizeMM, printHead, undefined);
      // }
    }
  }
  setAllButtonsInactive(printHead: PrintHead) {
    printHead.printPositionButtons.forEach(button => {
      button.selected = false;
    });
  }

  toggleButton(printHead: PrintHead, printHeadButton: PrintHeadButton) {
    printHeadButton.selected = !printHeadButton.selected;
    this.togglePrintHeadButton(printHead, printHeadButton.position, printHeadButton.selected);
  }
  getButtonWidthMM(printHead: PrintHead) {
    if(this._selectedPlate) {
      const buttonWidthMM = printHead.needle.odMM / (this._selectedPlate?.well_sizeMM / this.printPickerSizeMM);
      return buttonWidthMM;
    } else {
      return 0;
    }
  }

  getButtonLeftMM(printHead: PrintHead, buttonPosition: number) {
    const coordinates = this.getPrintPositionCoordinates(printHead.elementType, printHead.buttonWidthMM);
    if (coordinates[buttonPosition]) {
      return coordinates[buttonPosition].x;
    } else {
      return 0;
    }
  }

  getButtonTopMM(printHead: PrintHead, buttonPosition: number) {
    const coordinates = this.getPrintPositionCoordinates(printHead.elementType, printHead.buttonWidthMM);
    if(coordinates[buttonPosition]) {
      return coordinates[buttonPosition].y;
    } else {
      return 0;
    }
  }

  getPrintPositionCoordinates(parentType: 'PrintHead' | 'Well', dotSizeMM:number, adj_x= 0, adj_y= 0) {
    const wellSizeMM = parentType === 'PrintHead' ? this._printPickerSizeMM : this._selectedPlate?.well_sizeMM || 1;
    const radiusMM = (0.7 * wellSizeMM ) / 2;
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
    this.printPositionSelectionChanged.emit();
    return printPositionCoordinates;
  }

  public set printPickerSizeMM(size: number) {
    this._printPickerSizeMM = size;
  }

  public get printPickerSizeMM(): number {
    return this._printPickerSizeMM;
  }

  // updatePrintHeads(printHeads: PrintHead[]): void {
  //
  // }
  // updatePrintHead(updatedPrintHead: PrintHead): void {
  //   const printHeads = this._printHeads.getValue();
  //   const printHeadIndex = printHeads.findIndex(printHead => printHead.printHeadIndex === updatedPrintHead.printHeadIndex);
  //
  //   if (printHeadIndex > -1) {
  //     printHeads[printHeadIndex] = updatedPrintHead;
  //     this._printHeads.next(printHeads);
  //   } else {
  //     console.warn(`Warning(updatePrintHead): printHead with id ${updatedPrintHead.printHeadIndex} not found.`);
  //   }
  //   this.printPositionSelectionChanged.emit();
  // }

  updatePrintHeadsCount(numberOfPrintHeads: number) {
    const newPrintHead: PrintHead = {
      printHeadIndex: this.printHeads.length,
      description: '',
      color: this.getNextColor(),
      active: true,
      printPositionButtons: Array.from({ length: this.PRINT_POSITIONS_COUNT }, (_, index) => ({
        printHead: this.printHeads.length,
        position: index,
        color: this.getNextColor(),
        selected: false,
        originPX: { x: 0, y: 0 },
        originMM: { x: 0, y: 0 },
        style: {}
      })),
      needle: this.needles[0],
      printPositionSizeMM: this.needles[0].odMM,
      buttonWidthMM: 0,
      pickerWell: { sizeMM: this.printPickerSizeMM },
      elementType: 'PrintHead'
    };

    if (numberOfPrintHeads > this.printHeads.length) {
      for (let i = this.printHeads.length; i < numberOfPrintHeads; i++) {
        this.printHeads.push({ ...newPrintHead });
      }
    } else {
      this.printHeads = this.printHeads.slice(0, numberOfPrintHeads);
    }

    this.emitPrintHeads();
  }

  emitPrintHeads() {
    this._printHeads.next(this.printHeads);
    this.printPositionSelectionChanged.emit();
  }
  togglePrintHeadButton(printHead: PrintHead, buttonIndex: number, isSelected: boolean): void {
    if (printHead) {
      printHead.printPositionButtons[buttonIndex].selected = isSelected;
      this.emitPrintHeads();
    } else {
      console.warn(`Warning(togglePrintHeadButton): printHead is undefined.`);
    }
    this.printPositionSelectionChanged.emit();
  }

  updatePrintHeadNeedle(printHead: PrintHead, needle: Needle): void {
    const updatedPrintHead = {
      ...printHead,
      needle: needle
    };

    // Update the PrintHead in the _printHeads BehaviorSubject
    this.emitPrintHeads();
  }
  updatePrintHeadButtonSelection(printHead: PrintHead, isActive: boolean): void {
    if (printHead) {
      printHead.printPositionButtons.forEach(button => {
        button.selected = isActive;
      });
      this.emitPrintHeads();

    } else {
      console.warn(`Warning(updatePrintHeadButtonSelection): printHead is undefined.`);
    }
  }
  toPX(size_in_mm:number) {
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  scale(size: number, scalar: number) {
    return size*scalar;
  }

  private getNextColor(): string {
    const currentColorIndex = this.printHeads.length % this.colors.length;
    return this.colors[currentColorIndex];
  }


}
