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

import {BehaviorSubject, Subscription} from 'rxjs';
import {Injectable, OnDestroy} from "@angular/core";
import { Coordinates } from "../../types/Coordinates";
import { ScreenUtils } from "./screen-utils";
import { PrintHead, emptyPrintHead } from "../../types/PrintHead";
import { PlateFormat, emptyPlateFormat} from "../../types/PlateFormat";
import { Needle } from "../../types/Needle";
import { PlateFormatService } from "./plate-format.service";
import { PrintPositionService } from "./print-position.service";
import {StyleService} from "./style.service";

@Injectable({
  providedIn: 'root',
})

export class PrintHeadStateService implements OnDestroy {
  private _printHeads = new BehaviorSubject<PrintHead[]>([]);
  printHeads$ = this._printHeads.asObservable();
  private currentPrintHeads:PrintHead[] = [];

  private _printPickerSizeMM: number = 34.8;

  private selectedPlateSubscription!: Subscription;
  private currentSelectedPlate: PlateFormat;

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

    constructor(private screenUtils: ScreenUtils,
              private plateFormatService: PlateFormatService,
              private printPositionService: PrintPositionService,
              private styleService: StyleService) {

      const defaultPlateFormat: PlateFormat =  this.plateFormatService.plateFormats[0];
      this.currentSelectedPlate = defaultPlateFormat;

      // this.printPositionOriginsMM = this.printPositionService.getPrintPositionOriginsMM("print-head", defaultPlateFormat.well_sizeMM);

      this.selectedPlateSubscription = this.plateFormatService.selectedPlate$.subscribe((plate) => {
        this.currentSelectedPlate = plate;
        this.onSelectedPlateChange(plate);
      });
  }

  ngOnDestroy() {
    this.selectedPlateSubscription.unsubscribe();
  }

  // Generate printheads with default values and buttons
 loadDefaultPrintHeads(numPrintHeads: number): void {
    const printHeads: PrintHead[] = [];

    for (let i = 0; i < numPrintHeads; i++) {
      const createdPrintHead = this.createPrintHead(i);
      printHeads.push(createdPrintHead);
    }
    this.currentPrintHeads = printHeads;
    this._printHeads.next(printHeads);
  }

  onPrintHeadCountChange(numPrintHeads: number): void {
    const currentPrintHeadCount = this.currentPrintHeads.length;

    if (numPrintHeads > currentPrintHeadCount) {
      while (this.currentPrintHeads.length < numPrintHeads) {
        const createPrintHead = this.createPrintHead(this.currentPrintHeads.length);
        this.printPositionService.getNewButtonsSize('print-head', createPrintHead, this.currentSelectedPlate.well_sizeMM, createPrintHead.needle.odMM);
        this.currentPrintHeads.push(createPrintHead);
      }
    } else if (numPrintHeads < currentPrintHeadCount) {
      while (this.currentPrintHeads.length > numPrintHeads ) {
        this.currentPrintHeads.pop();
        this.printPositionService.printPositionButtonWidthPX.pop();
      }
    }

    this._printHeads.next(this.currentPrintHeads);
  }

  private createPrintHead(printHeadIndex: number): PrintHead {
    console.log('createPrintHead thinks well diam: ', this.currentSelectedPlate.well_sizeMM);
    const newPrintHead: PrintHead = emptyPrintHead();
    newPrintHead.printHeadIndex = printHeadIndex;
    newPrintHead.color = this.styleService.THEME_COLORS.defaultLightTheme[printHeadIndex % this.styleService.THEME_COLORS.defaultLightTheme.length];

    newPrintHead.needle = this.needles[0];

    newPrintHead.printPositions = this.printPositionService.loadPrintPositionButtons(
      'print-head',
      printHeadIndex,
      this.currentSelectedPlate.well_sizeMM,
      this.needles[0].odMM);

    console.log('created new printhead: ', newPrintHead);
    return newPrintHead;
  }


  // Toggle print position button's status
  toggleButtonStatus(printHeadIndex: number, buttonIndex: number): void {
    const currentPrintHeads = this._printHeads.value;
    const selectedPrintHead = currentPrintHeads[printHeadIndex];

    if (selectedPrintHead && selectedPrintHead.printPositions[buttonIndex]) {
      const button = selectedPrintHead.printPositions[buttonIndex];
      button.selected = !button.selected;
      this._printHeads.next(currentPrintHeads);
    } else {
      console.error(`Invalid printHeadIndex or buttonIndex: (${printHeadIndex}, ${buttonIndex})`);
    }
  }


  // Set all buttons to inactive
  setAllButtonsInactive(printHeadIndex: number): void {
    const currentPrintHeads = this._printHeads.value;

    if (currentPrintHeads[printHeadIndex]) {
      const selectedPrintHead = currentPrintHeads[printHeadIndex];
      selectedPrintHead.printPositions.forEach(button => {
        button.selected = false;
      });
      this._printHeads.next(currentPrintHeads);
    } else {
      console.error(`Invalid printHeadIndex: ${printHeadIndex}`);
    }
  }


  // Update needle property and resize print position buttons
  updateNeedle(printHeadIndex: number, newNeedle: Needle): void {
    const currentPrintHeads = this._printHeads.value;

    if (currentPrintHeads[printHeadIndex]) {
      const selectedPrintHead = currentPrintHeads[printHeadIndex];
      selectedPrintHead.needle = newNeedle;

      // Assuming the function `resizePrintPositionButtons` is already implemented
      // to resize print position buttons based on the needle outer diameter.
      // console.log('resizePrintPositionButtons called with selectedPrintHead.printHeadIndex: ', selectedPrintHead.printHeadIndex, ' newNeedle.odMM: ', newNeedle.odMM);
      // this.resizePrintPositionButtons(selectedPrintHead.printHeadIndex, newNeedle.odMM);
      this._printHeads.next(currentPrintHeads);
    } else {
      console.error(`Invalid printHeadIndex: ${printHeadIndex}`);
    }
  }



  // Update color property and active state color of print position buttons
  updateColor(printHeadIndex: number, newColor: string): void {
    const currentPrintHeads = this._printHeads.value;

    if (currentPrintHeads[printHeadIndex]) {
      const selectedPrintHead = currentPrintHeads[printHeadIndex];
      selectedPrintHead.color = newColor;

      // Update the active state color of print position buttons
      selectedPrintHead.printPositions.forEach(printPosition => {
        printPosition.button.color = newColor
      });

      this._printHeads.next(currentPrintHeads);
    } else {
      console.error(`Invalid printHeadIndex: ${printHeadIndex}`);
    }
  }

  updateDescription(printHeadIndex: number, newDescription: string): void {
    const currentPrintHeads = this._printHeads.value;

    if (currentPrintHeads[printHeadIndex]) {
      const selectedPrintHead = currentPrintHeads[printHeadIndex];
      selectedPrintHead.description = newDescription;
      this._printHeads.next(currentPrintHeads);
    } else {
      console.error(`Invalid printHeadIndex: ${printHeadIndex}`);
    }
  }

  onSelectedPlateChange(plate: PlateFormat) {
    if (plate) {
      for(let printHead of this.currentPrintHeads) {
        this.printPositionService.getNewButtonsSize('print-head', printHead, plate.well_sizeMM,printHead.needle.odMM);
      }
    } else {
      console.warn('printhead state service has no idea what plate youre talking about');
    }
  }
  // Update print depth properties
  updatePrintDepth(printHeadIndex: number, printDepthStart: number, printDepthEnd: number): void {
    // Implement the functionality to update print depth properties
  }
}






//

//
//   printHeads: PrintHead[] = [];
//   private _printHeads = new BehaviorSubject<PrintHead[]>([]);
//   public printHeads$ = this._printHeads.asObservable();

//

//
//   updatePrintHeadButtons(printHead: PrintHead, buttonIndex?: number, updateAll: boolean = false): void {
//     if (updateAll) {
//       if (!printHead.active) {
//         printHead.printPositionButtons.forEach(button => (button.selected = false));
//       } else {
//         // if (this.selectedPlate) { // Add this check
//         // this.printPositionService.repopulatePrintPositionButtons(this.selectedPlate.well_sizeMM, printHead, undefined);
//         // }
//       }
//     } else if (buttonIndex !== undefined) {
//       const button = printHead.printPositionButtons[buttonIndex];
//       button.selected = !button.selected;
//     }
//
//     this._printHeads.next(this._printHeads.value);
//   }
//
//   initializePrintHeads(initialCount: number) {
//     const initialPrintHeads: PrintHead[] = [];
//
//     for (let i = 0; i < initialCount; i++) {
//       const colorIndex = i % this.colors.length;
//       const newPrintHead = this.createPrintHeads(i);
//       for(let b = 0; b < this.PRINT_POSITIONS_COUNT; b++) {
//         const color = this.colors[colorIndex]
//         const tempButton: PrintHeadButton = {
//           printHead: i,
//           position: b,
//           selected: false,
//           originPX: { x: 0, y: 0 },
//           originMM: { x: 0, y: 0 },
//           style: {
//             color: this.colors[colorIndex],
//           },
//         };
//         const addStyle = this.getStylePrintPositionButton(newPrintHead, tempButton);
//         console.log('addStyle: ', addStyle);
//         tempButton.style = addStyle;
//       }
//       initialPrintHeads.push(newPrintHead);
//     }
//
//     this._printHeads.next(initialPrintHeads);
//   }
//
//
//   createPrintHeads(printHeadIndex: number) {
//     const colorIndex = printHeadIndex % this.colors.length;
//
//     const newPrintHead: PrintHead = {
//       printHeadIndex: this.printHeads.length,
//       description: '',
//       color: this.colors[colorIndex],
//       active: true,
//       printPositionButtons: Array.from({ length: this.PRINT_POSITIONS_COUNT }, (_, index) => {
//         const tempButton = emptyPrintHeadButton();
//         tempButton.printHead = this.printHeads.length;
//         tempButton.position = index;
//         tempButton.style = {
//           ...tempButton.style,
//           color: this.colors[colorIndex]
//         };
//         return tempButton;
//       }),
//       needle: this.needles[0],
//       printPositionSizeMM: this.needles[0].odMM,
//       buttonWidthPX: this.toPX(this.needles[0].odMM),
//       pickerWell: { sizeMM: this.printPositionService.PRINT_PICKER_DIAM_MM },
//       elementType: 'PrintHead'
//     };
//
//     const updatedPrintHeads = [...this._printHeads.value];
//
//     if (printHeadIndex > updatedPrintHeads.length) {
//       for (let i = updatedPrintHeads.length; i < printHeadIndex; i++) {
//         const printHeadWithCorrectIndex = { ...newPrintHead, printHeadIndex: i };
//         updatedPrintHeads.push(printHeadWithCorrectIndex);
//       }
//     } else {
//       updatedPrintHeads.length = printHeadIndex;
//     }
//
//     this._printHeads.next(updatedPrintHeads);
//     return newPrintHead;
//   }
//
//   togglePrintHeadButton(printHead: PrintHead, buttonIndex: number, isSelected: boolean): void {
//     console.log('-- printHead state service togglePrintHeadButton called: ', printHead, buttonIndex, isSelected);
//
//     if (printHead) {
//       printHead.printPositionButtons[buttonIndex].selected = !isSelected;
//       // this.emitPrintHeads();
//     } else {
//       console.warn(`Warning(togglePrintHeadButton): printHead is undefined.`);
//     }
//     console.log('---- _printHeads.next: ', this.printHeads);
//     this._printHeads.next(this.printHeads);
//
//   }
//   toggleButton(printHead: PrintHead, printHeadButton: PrintHeadButton) {
//     console.log('-- toggleButton');
//     printHeadButton.selected = !printHeadButton.selected;
//     // this.updateAllPrintHeadButtons(printHead);
//     console.log('---- _printHeads.next: ', this.printHeads);
//     this._printHeads.next(this.printHeads);
//   }
//   updatePrintHeadNeedle(printHead: PrintHead, needle: Needle): void {
//     console.log('-- updatePrintHeadNeedle');
//     // TODO: how to get platemap to update when needle changes
//     //       right now changing the needle changes the button sizes on the plateamap
//     //       but not their top and left properties
//     const buttonWidthMM = this.printPositionService.getButtonWidthMM('print-head', needle.odMM, this._selectedPlate?.well_sizeMM);
//     const updatedPrintHead = {
//       ...printHead,
//       needle: needle,
//       buttonWidthMM: buttonWidthMM,
//     };
//
//     // Find the index of the printHead to be updated in the _printHeads BehaviorSubject
//     const index = this._printHeads.value.findIndex(ph => ph.printHeadIndex === printHead.printHeadIndex);
//
//     //Update the PrintHead in the _printHeads BehaviorSubject
//     if (index !== -1) {
//       const updatedPrintHeads = [...this._printHeads.value];
//       updatedPrintHeads[index] = updatedPrintHead;
//       console.log('---- _printHeads.next: ', updatedPrintHeads);
//       this._printHeads.next(updatedPrintHeads); // emit the updated _printHeads array
//     }
//   }
//
//   updatePrintPositionColor(printHead: PrintHead, color: string): void {
//     console.log('-- updatePrintPositionColor');
//     const updatedPrintHead = {
//       ...printHead,
//       color: color,
//     };
//
//     // Find the index of the printHead to be updated in the _printHeads BehaviorSubject
//     const index = this._printHeads.value.findIndex(ph => ph.printHeadIndex === printHead.printHeadIndex);
//
//     //Update the PrintHead in the _printHeads BehaviorSubject
//     if (index !== -1) {
//       const updatedPrintHeads = [...this._printHeads.value];
//       updatedPrintHeads[index] = updatedPrintHead;
//       console.log('---- _printHeads.next: ', updatedPrintHeads);
//       this._printHeads.next(updatedPrintHeads); // emit the updated _printHeads array
//     }
//   }
//
//
//
//   // Maybe try separate functions for each calculated style value
//   getStylePrintPositionButton(printHead: PrintHead, printHeadButton: PrintHeadButton) {
//     // console.log('getStylePrintPositionButton: needleOdMM:', printHead.needle.odMM);
//     const buttonSizePX = this.getPrintPositionButtonWidthPX(printHead.needle.odMM);
//     let topPX = this.getButtonTopPX(printHeadButton.position) - (buttonSizePX/2);
//     let lfPX = this.getButtonLeftPX(printHeadButton.position) - (buttonSizePX/2);
//     const buttonColor = printHead.active? (printHeadButton.selected ? printHead.color : 'white') : '#f1f1f1';
//     const buttonStyle = {
//       ...this.customButtonToggleStyle,
//       'width': buttonSizePX + 'px',
//       'top': topPX + 'px',
//       'left': lfPX + 'px',
//       'background-color': buttonColor,
//     }
//     console.log(buttonStyle);
//     return buttonStyle;
//
//   }
//
//   getPrintPositionButtonWidthPX(needleOdMM: number) {
//     // console.log('getPrintPositionButtonWidthPX: needleOdMM:', needleOdMM, 'plateMapWellDiamMM:', this._selectedPlate?.well_sizeMM)
//     const plateMapWellDiamMM = this._selectedPlate?.well_sizeMM;
//     return this.toPX(this.printPositionService.getButtonWidthMM('print-head', needleOdMM, plateMapWellDiamMM));
//   }
//   getButtonLeftPX(printHeadButtonPosition: number) {
//     return this.toPX(this.printPositionService.getButtonLeftMM(this.printPositionOriginsMM, printHeadButtonPosition));
//   }
//
//   getButtonTopPX(printHeadButtonPosition: number) {
//     return this.toPX(this.printPositionService.getButtonTopMM(this.printPositionOriginsMM, printHeadButtonPosition));
//   }
//   updatePrintHeadButtonSelection(printHead: PrintHead, isActive: boolean): void {
//     console.log('-- updatePrintHeadButtonSelection');
//     if (printHead) {
//       const updatedPrintHead = {
//         ...printHead,
//         printPositionButtons: printHead.printPositionButtons.map(button => ({
//           ...button,
//           selected: isActive
//         }))
//       };
//
//       // Find the index of the printHead to be updated in the _printHeads BehaviorSubject
//       const index = this._printHeads.value.findIndex(ph => ph.printHeadIndex === printHead.printHeadIndex);
//
//       // Update the PrintHead in the _printHeads BehaviorSubject
//       if (index !== -1) {
//         const updatedPrintHeads = [...this._printHeads.value];
//         updatedPrintHeads[index] = updatedPrintHead;
//         console.log('---- _printHeads.next: ', updatedPrintHeads);
//         this._printHeads.next(updatedPrintHeads); // emit the updated _printHeads array
//       }
//
//     } else {
//       console.warn(`Warning(updatePrintHeadButtonSelection): printHead is undefined.`);
//     }
//   }
//
//   scale(size: number, scalar: number) {
//     return size*scalar;
//   }
//
// }
