/*
Print-head state service is in charge of maintining the current state of all the printheads
including:
  printhead description
  active state
  needle selected
  color
  selection state of print positions
  print depth information
 */

import {BehaviorSubject} from 'rxjs';
import {Injectable} from "@angular/core";
import { Coordinates } from "../../types/Coordinates";
import { ScreenUtils } from "./screen-utils";
import { PrintHead } from "../../types/PrintHead";
import { PlateFormat } from "../../types/PlateFormat";
import { Needle } from "../../types/Needle";
import { PlateFormatService } from "./plate-format.service";
import {PrintHeadButton} from "../../types/PrintHeadButton";
import { PrintPositionService } from "./print-position.service";
import {StyleService} from "./style.service";

@Injectable({
  providedIn: 'root',
})

export class PrintHeadStateService {
  public customButtonToggleStyle: any;
  private _printPositionCoordinates = new BehaviorSubject<Coordinates[]>([]);
  public printPositionCoordinates$ = this._printPositionCoordinates.asObservable();

  private printPositionOriginsMM: Coordinates[] = [];
  printHeadButtons: PrintHeadButton[] = [];
  numberOfPrintHeads: number = 1;

  PRINT_POSITIONS_COUNT = 9;
  private printPositionAngles = Array.from({length: this.PRINT_POSITIONS_COUNT - 1}, (_, i) => i / (this.PRINT_POSITIONS_COUNT - 1) * 2 * Math.PI);
  private printPositionCoordinates: Coordinates[] = [];

  private _selectedPlate: PlateFormat | null = null;
  private colors: string[] = [
    '#009ADE',
    '#FF1F5B',
    '#00CD6C',
    '#FFC61E',
    '#AF58BA',
    '#F28522',
  ];

  constructor(private screenUtils: ScreenUtils,
              private plateFormatService: PlateFormatService,
              private printPositionService: PrintPositionService,
              private styleService: StyleService) {
    const defaultPlateFormat =  this.plateFormatService.plateFormats[0];
    this.customButtonToggleStyle = this.styleService.getBaseStyle('custom-button-toggle');

    this.printPositionOriginsMM = this.printPositionService.getPrintPositionOriginsMM("print-head", defaultPlateFormat.well_sizeMM);

    this.plateFormatService.selectedPlate$.subscribe((plate) => {
      this._selectedPlate = plate; // <-- Add this line
      console.log('printhead state service updates selected plate');
      this.onSelectedPlateChange(plate);
    });
  }

  printHeads: PrintHead[] = [];
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

    // if (plate) {
    //   // console.log('print-head-state-service plate: ', plate);
    //   this.printPositionCoordinates = this.printPositionService.getPrintPositionCoordinates('Well', plate.printPositionSizeMM);
    //   this._printPositionCoordinates.next(this.printPositionCoordinates);
    // } else {
    //   console.warn('printhead state service has no idea what plate youre talking about');
    //   this.printPositionCoordinates = [];
    // }
  }

  onPrintHeadsUpdate(printHeads: PrintHead[] | null) {

  }

  updatePrintHeadButtons(printHead: PrintHead, buttonIndex?: number, updateAll: boolean = false) {
    if (updateAll) {
      this.updateAllPrintHeadButtons(printHead);
    } else if (buttonIndex !== undefined) {
      this.toggleButton(printHead, printHead.printPositionButtons[buttonIndex]);
    }
    this._printHeads.next(this._printHeads.value);
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

  initializePrintHeads(initialCount: number) {
    const initialPrintHeads: PrintHead[] = [];

    for (let i = 0; i < initialCount; i++) {
      const newPrintHead = this.createPrintHeads(i);
      initialPrintHeads.push(newPrintHead);
    }

    this._printHeads.next(initialPrintHeads);
  }

  createPrintHeads(printHeadIndex: number) {
    const colorIndex = printHeadIndex % this.colors.length;

    const newPrintHead: PrintHead = {
      printHeadIndex: this.printHeads.length,
      description: '',
      color: this.colors[colorIndex],
      active: true,
      printPositionButtons: Array.from({ length: this.PRINT_POSITIONS_COUNT }, (_, index) => ({
        printHead: this.printHeads.length,
        position: index,
        color: this.colors[colorIndex],
        selected: false,
        originPX: { x: 0, y: 0 },
        originMM: { x: 0, y: 0 },
        style: {}
      })),
      needle: this.needles[0],
      printPositionSizeMM: this.needles[0].odMM,
      buttonWidthPX: this.toPX(this.needles[0].odMM),
      pickerWell: { sizeMM: this.printPositionService.PRINT_PICKER_DIAM_MM },
      elementType: 'PrintHead'
    };

    const updatedPrintHeads = [...this._printHeads.value];

    if (printHeadIndex > updatedPrintHeads.length) {
      for (let i = updatedPrintHeads.length; i < printHeadIndex; i++) {
        const printHeadWithCorrectIndex = { ...newPrintHead, printHeadIndex: i };
        updatedPrintHeads.push(printHeadWithCorrectIndex);
      }
    } else {
      updatedPrintHeads.length = printHeadIndex;
    }

    this._printHeads.next(updatedPrintHeads);
    return newPrintHead;
  }

  togglePrintHeadButton(printHead: PrintHead, buttonIndex: number, isSelected: boolean): void {
    console.log('-- printHead state service togglePrintHeadButton called: ', printHead, buttonIndex, isSelected);

    if (printHead) {
      printHead.printPositionButtons[buttonIndex].selected = !isSelected;
      // this.emitPrintHeads();
    } else {
      console.warn(`Warning(togglePrintHeadButton): printHead is undefined.`);
    }
    console.log('---- _printHeads.next: ', this.printHeads);
    this._printHeads.next(this.printHeads);

  }
  toggleButton(printHead: PrintHead, printHeadButton: PrintHeadButton) {
    console.log('-- toggleButton');
    printHeadButton.selected = !printHeadButton.selected;
    this.updateAllPrintHeadButtons(printHead);
    console.log('---- _printHeads.next: ', this.printHeads);
    this._printHeads.next(this.printHeads);
  }
  updatePrintHeadNeedle(printHead: PrintHead, needle: Needle): void {
    console.log('-- updatePrintHeadNeedle');
    // TODO: how to get platemap to update when needle changes
    //       right now changing the needle changes the button sizes on the plateamap
    //       but not their top and left properties
    const buttonWidthMM = this.printPositionService.getButtonWidthMM('print-head', needle.odMM, this._selectedPlate?.well_sizeMM);
    const updatedPrintHead = {
      ...printHead,
      needle: needle,
      buttonWidthMM: buttonWidthMM,
    };

    // Find the index of the printHead to be updated in the _printHeads BehaviorSubject
    const index = this._printHeads.value.findIndex(ph => ph.printHeadIndex === printHead.printHeadIndex);

    //Update the PrintHead in the _printHeads BehaviorSubject
    if (index !== -1) {
      const updatedPrintHeads = [...this._printHeads.value];
      updatedPrintHeads[index] = updatedPrintHead;
      console.log('---- _printHeads.next: ', updatedPrintHeads);
      this._printHeads.next(updatedPrintHeads); // emit the updated _printHeads array
    }
  }

  updatePrintPositionColor(printHead: PrintHead, color: string): void {
    console.log('-- updatePrintPositionColor');
    const updatedPrintHead = {
      ...printHead,
      color: color,
    };

    // Find the index of the printHead to be updated in the _printHeads BehaviorSubject
    const index = this._printHeads.value.findIndex(ph => ph.printHeadIndex === printHead.printHeadIndex);

    //Update the PrintHead in the _printHeads BehaviorSubject
    if (index !== -1) {
      const updatedPrintHeads = [...this._printHeads.value];
      updatedPrintHeads[index] = updatedPrintHead;
      console.log('---- _printHeads.next: ', updatedPrintHeads);
      this._printHeads.next(updatedPrintHeads); // emit the updated _printHeads array
    }
  }

  updatePrintPositionButtonStyle(printHead: PrintHead, printHeadButton: PrintHeadButton) {
    printHeadButton.style = this.getStylePrintPositionButton(printHead, printHeadButton);
  }
  // Maybe try separate functions for each calculated style value
  getStylePrintPositionButton(printHead: PrintHead, printHeadButton: PrintHeadButton) {
    // console.log('getStylePrintPositionButton: needleOdMM:', printHead.needle.odMM);
    const buttonSizePX = this.getPrintPositionButtonWidthPX(printHead.needle.odMM);
    let topPX = this.getButtonTopPX(printHeadButton.position) - (buttonSizePX/2);
    let lfPX = this.getButtonLeftPX(printHeadButton.position) - (buttonSizePX/2);
    const buttonColor = printHead.active? (printHeadButton.selected ? printHead.color : 'white') : '#f1f1f1';

    return {
      ...this.customButtonToggleStyle,
      'width': buttonSizePX + 'px',
      'top': topPX + 'px',
      'left': lfPX + 'px',
      'background-color': buttonColor,
    };
  }
  getPrintPositionButtonWidthPX(needleOdMM: number) {
    // console.log('getPrintPositionButtonWidthPX: needleOdMM:', needleOdMM, 'plateMapWellDiamMM:', this._selectedPlate?.well_sizeMM)
    const plateMapWellDiamMM = this._selectedPlate?.well_sizeMM;
    return this.toPX(this.printPositionService.getButtonWidthMM('print-head', needleOdMM, plateMapWellDiamMM));
  }
  getButtonLeftPX(printHeadButtonPosition: number) {
    return this.toPX(this.printPositionService.getButtonLeftMM(this.printPositionOriginsMM, printHeadButtonPosition));
  }

  getButtonTopPX(printHeadButtonPosition: number) {
    return this.toPX(this.printPositionService.getButtonTopMM(this.printPositionOriginsMM, printHeadButtonPosition));
  }
  updatePrintHeadButtonSelection(printHead: PrintHead, isActive: boolean): void {
    console.log('-- updatePrintHeadButtonSelection');
    if (printHead) {
      const updatedPrintHead = {
        ...printHead,
        printPositionButtons: printHead.printPositionButtons.map(button => ({
          ...button,
          selected: isActive
        }))
      };

      // Find the index of the printHead to be updated in the _printHeads BehaviorSubject
      const index = this._printHeads.value.findIndex(ph => ph.printHeadIndex === printHead.printHeadIndex);

      // Update the PrintHead in the _printHeads BehaviorSubject
      if (index !== -1) {
        const updatedPrintHeads = [...this._printHeads.value];
        updatedPrintHeads[index] = updatedPrintHead;
        console.log('---- _printHeads.next: ', updatedPrintHeads);
        this._printHeads.next(updatedPrintHeads); // emit the updated _printHeads array
      }

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

}
