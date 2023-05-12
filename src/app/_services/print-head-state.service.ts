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
import { ScreenUtils } from "./screen-utils";
import { PrintHead, emptyPrintHead } from "../../types/PrintHead";
import { PlateFormat, emptyPlateFormat} from "../../types/PlateFormat";
import { Needle } from "../../types/Needle";
import { PlateFormatService } from "./plate-format.service";
import { PrintPositionService } from "./print-position.service";
import {StyleService} from "./style.service";
import {PrintPosition} from "../../types/PrintPosition";
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {WellsStateService} from "./wells-state.service";

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
              private styleService: StyleService,
                private wellsStateService: WellsStateService,
                ) {
      const printheadCreation$ = new BehaviorSubject<boolean>(false);

      printheadCreation$
        .pipe(
          switchMap(created => {
            if (created) {
              // Perform actions and retrieve necessary data after printhead creation
              // Return an observable that emits the required data for subsequent services

              // Example:
              // return this.someService.getDataForSubsequentServices(); // Replace with your actual service method
              console.log('new thing was triggered');
              return of(null);
            } else {
              // Return an empty observable if printhead is not created yet
              return of(null);
            }
          })
        )
        .subscribe(data => {
          // Handle the received data by the subsequent services
          // This code block will be executed after the printhead creation and the data retrieval

          if (data) {
            // Perform actions with the received data
            console.log('Received data for subsequent services:', data);

            // Example: Notify the necessary services about the data
            this.wellsStateService.notifyData(data);
            this.plateFormatService.setNextPlate(data);
            // ...
          } else {
            console.log('Printhead not created yet. Waiting for creation...');
          }
        });

      // Trigger printhead creation and update the printheadCreation$ observable
      this.loadDefaultPrintHeads(1); // Call this method when the printhead is created
      printheadCreation$.next(true);
      const defaultPlateFormat: PlateFormat =  this.plateFormatService.plateFormats[0];
      this.currentSelectedPlate = defaultPlateFormat;

      // this.printPositionOriginsMM = this.printPositionService.getPrintPositionOriginsMM("print-head", defaultPlateFormat.well_sizeMM);

      this.selectedPlateSubscription = this.plateFormatService.selectedPlate$.subscribe((plate) => {
        console.log('printhead state service received: ', plate);
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
        // this.printPositionService.getNewButtonsSize('print-head', createPrintHead, this.currentSelectedPlate.well_sizeMM, createPrintHead.needle.odMM);
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
      if(this.currentSelectedPlate) {
        console.log('createPrintHead thinks well diam: ', this.currentSelectedPlate.well_sizeMM);
        const newPrintHead: PrintHead = emptyPrintHead();
        newPrintHead.index = printHeadIndex;
        newPrintHead.color = this.styleService.THEME_COLORS.defaultLightTheme[printHeadIndex % this.styleService.THEME_COLORS.defaultLightTheme.length];

        newPrintHead.needle = this.needles[0];
        console.log("let's load some printPositions");
        newPrintHead.printPositions = this.printPositionService.loadPrintPositionButtons(
          'print-head',
          printHeadIndex,
          this.currentSelectedPlate.well_sizeMM,
          this.needles[0].odMM);
        this.printPositionService.printPositionsChanged.next(newPrintHead.printPositions);

        return newPrintHead;
      } else {
        return emptyPrintHead();
      }
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

  // Update needle property and resize print position buttons
  updateNeedle(printHead: PrintHead, newNeedle: Needle): void {
    const currentPrintHeads = this._printHeads.value;

    if (printHead) {
      printHead.needle = newNeedle;

      const updatedPrintPositions: PrintPosition[] = this.printPositionService.updatePrintPositionsBasedOnNeedle(
        printHead,
        this.currentSelectedPlate.well_sizeMM,
        newNeedle.odMM);
      this.printPositionService.printPositionsChanged.next(updatedPrintPositions);

      this._printHeads.next(currentPrintHeads);
    } else {
      console.error(`Invalid printHead`);
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

  updateTemperature(printHeadIndex: number, newTemperature: number): void {
    const currentPrintHeads = this._printHeads.value;

    if (currentPrintHeads[printHeadIndex]) {
      const selectedPrintHead = currentPrintHeads[printHeadIndex];
      selectedPrintHead.temperature = newTemperature;

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
        // this.printPositionService.getNewButtonsSize('print-head', printHead, plate.well_sizeMM,printHead.needle.odMM);
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
