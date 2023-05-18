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
import { Printhead, emptyPrinthead } from "../../types/Printhead";
import { PlateFormat, emptyPlateFormat} from "../../types/PlateFormat";
import { Needle, needles } from "../../types/Needle";
import { PlateFormatService } from "./plate-format.service";
import { PrintPositionService } from "./print-position.service";
import {StyleService} from "./style.service";
import {emptyPrintPosition, PrintPosition} from "../../types/PrintPosition";
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {WellsStateService} from "./wells-state.service";

@Injectable({
  providedIn: 'root',
})

export class PrintHeadStateService implements OnDestroy {
  private _printHeads = new BehaviorSubject<Printhead[]>([]);
  printHeads$ = this._printHeads.asObservable();
  private currentPrintHeads:Printhead[] = [];

  private selectedPlateSubscription!: Subscription;
  private currentSelectedPlate: PlateFormat;

  private needles!: Needle[];

    constructor(private screenUtils: ScreenUtils,
              private plateFormatService: PlateFormatService,
              private printPositionService: PrintPositionService,
              private styleService: StyleService,
                private wellsStateService: WellsStateService,
                ) {
      this.needles = needles;

      // Trigger printhead creation and update the printheadCreation$ observable
      this.createPrintHead(0); // Call this method when the printhead is created
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

  /**
   * Updates multiple properties of a PrintHead based on the provided printHeadIndex and key-value pairs.
   *
   * @param {number} printHead - The PrintHead to be updated.
   * @param {Partial<Printhead>} properties - An object containing key-value pairs of the properties to be updated.
   */
  updatePrintHeadProperties(printHead: Printhead, properties: Partial<Printhead>): void {
    if (this.currentPrintHeads[printHead.index]) {
      const selectedPrintHead = this.currentPrintHeads[printHead.index];

      Object.keys(properties).forEach(key => {
        if (key in selectedPrintHead && properties[key as keyof Printhead] !== undefined) {
          this.updatePrintHeadProperty(printHead.index, key as keyof Printhead, properties[key as keyof Printhead]!, false);
        } else if (!(key in selectedPrintHead)) {
          console.error(`Invalid property key: ${key} does not exist in the PrintHead object.`);
        } else if (properties[key as keyof Printhead] === undefined) {
          console.error(`Undefined value error: The value for ${key} in the properties object is undefined.`);
        }
      });
      this._printHeads.next(this.currentPrintHeads);
    } else {
      console.error(`updatePrintHeadProperties Invalid printHeadIndex: ${printHead.index}`);
    }
  }

  /**
   * Updates a single property of a PrintHead based on the provided printHeadIndex and key-value pair.
   *
   * @param {number} printHeadIndex - The index of the PrintHead to be updated.
   * @param {keyof Printhead} propertyKey - The key of the PrintHead property to be updated.
   * @param {string | number | boolean | Needle | PrintHeadBehavior | PrintPosition[] | { sizeMM: number }} propertyValue - The new value for the PrintHead property.
   */
  updatePrintHeadProperty<K extends keyof Printhead>(printHeadIndex: number, key: K, value: Printhead[K], emitNext: Boolean = true): void {
    if (this.currentPrintHeads[printHeadIndex]) {
      const selectedPrintHead = this.currentPrintHeads[printHeadIndex];

      selectedPrintHead[key] = value;
      if(emitNext) {
        this._printHeads.next(this.currentPrintHeads);
        console.log(' --print-head-state-service -- updatePrintHeadProperty -- next(printheads)');
      }
    } else {
      console.error(`updatePrintHeadProperty Invalid printHeadIndex: ${printHeadIndex}`);
    }
  }

  /**
   * Updates the number of PrintHeads based on the provided numPrintHeads value.
   *
   * @param {number} numPrintHeads - The new number of PrintHeads.
   */
  onPrintHeadCountChange(numPrintHeads: number): void {
    console.log(' -- print-head-state-service -- onPrintheadCountChange');
    const currentPrintHeadCount = this.currentPrintHeads.length;
    if (numPrintHeads > currentPrintHeadCount) {
      // Add new print heads
      console.log(' ------------ add new printhead');
      while (this.currentPrintHeads.length < numPrintHeads) {
        const createPrintHead = this.createPrintHead(this.currentPrintHeads.length);
      }
    } else if (numPrintHeads < currentPrintHeadCount) {
      console.log(' ------------ remove printhead');
      // Remove excess print heads
      while (this.currentPrintHeads.length > numPrintHeads ) {
        this.currentPrintHeads.pop();
      }
    }

    // Emit updated print heads
    // console.log(' --print-head-state-service -- onPrintHeadCountChange -- next(printheads)');
    // this._printHeads.next(this.currentPrintHeads);
  }

  private createPrintHead(printHeadIndex: number): Printhead {
    const newPrintHead: Printhead = emptyPrinthead();
    this.currentPrintHeads.push(newPrintHead);
    newPrintHead.index = printHeadIndex;
    newPrintHead.color = this.styleService.THEME_COLORS.defaultLightTheme[printHeadIndex % this.styleService.THEME_COLORS.defaultLightTheme.length];

    newPrintHead.needle = this.needles[0];
    const well_sizeMM = this.currentSelectedPlate ? this.currentSelectedPlate.well_sizeMM : 1;
    newPrintHead.printPositions = this.printPositionService.loadPrintPositionButtons(
      'print-head',
      printHeadIndex,
      well_sizeMM,
      this.needles[0].odMM);

    this.updatePrintHeadProperties(newPrintHead, {
      index: printHeadIndex,
      color: newPrintHead.color,
      needle: newPrintHead.needle,
      printPositions: newPrintHead.printPositions,
    });

    console.log(' --print-head-state-service -- createPrintHead -- next(printheads)');
    this._printHeads.next(this.currentPrintHeads);

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

  // Update needle property and resize print position buttons
  updateNeedle(printHead: Printhead, newNeedle: Needle): void {
    const currentPrintHeads = this._printHeads.value;

    if (printHead) {
      printHead.needle = newNeedle;
      console.log('print-head-state-service resizing printposition buttons for printhead');
      const updatedPrintPositions: PrintPosition[] = this.printPositionService.resizePrintPositions(
        printHead,
        this.currentSelectedPlate.well_sizeMM,
        newNeedle.odMM);
      console.log(' --print-head-state-service -- updateNeedle -- next(printheads)');

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
      console.log(' --print-head-state-service -- updateColor -- next(printheads)');

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
      console.log(' --print-head-state-service -- updateTemperature -- next(printheads)');

      this._printHeads.next(currentPrintHeads);
    } else {
      console.error(`Invalid printHeadIndex: ${printHeadIndex}`);
    }
  }

  onSelectedPlateChange(plate: PlateFormat) {
    if (plate) {
      console.log('print-head-state-service onSelectedPlateChange');
      for(let printHead of this.currentPrintHeads) {
        if(printHead.needle) {
          printHead.printPositions = this.printPositionService.resizePrintPositions(printHead, plate.well_sizeMM, printHead.needle.odMM);
        } else {
          console.log("print-head-state-service can't resize print positions for printhead[", printHead.index, "] until needle is selected.")
        }
      }
      this._printHeads.next(this.currentPrintHeads);
    } else {
      console.warn('printhead state service has no idea what plate youre talking about');
    }
  }
  // Update print depth properties
  updatePrintDepth(printHeadIndex: number, printDepthStart: number, printDepthEnd: number): void {
    // Implement the functionality to update print depth properties
  }
}
