import {
  Component, OnChanges,
  OnDestroy,
  OnInit, SimpleChanges,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Input, Output, EventEmitter
} from '@angular/core';
import { PlateFormat } from "../../types/PlateFormat";
import { ScreenUtils } from "../_services/screen-utils";
import { PrintHeadStateService } from "../_services/print-head-state.service"
import { PrintHead } from "../../types/PrintHead";
import {Needle} from "../../types/Needle";
import {StyleService} from "../_services/style.service";
import { PlateFormatService } from "../_services/plate-format.service";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {Subscription} from "rxjs";
import {availablePrintHeads, PrintHeadBehavior} from "../../types/PrintHeadBehavior";
import {PrintPositionService} from "../_services/print-position.service";

@Component({
  selector: 'app-printhead-card-component',
  templateUrl: './print-head-card.component.html',
  styleUrls: ['./print-head-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintHeadCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() printhead!: PrintHead;
  @Input() printheadIndex!: number;

  private subscriptions: Subscription[] = [];

  selectedNeedle!: any;
  selectedColor!: any;
  _selectedPlate!: PlateFormat;

  activeToggle: boolean = false;
  constructor(
    private screenUtils: ScreenUtils,
    private printHeadStateService: PrintHeadStateService,
    private styleService: StyleService,
    private plateFormatService: PlateFormatService,
    private printPositionService: PrintPositionService) {

    this.subscriptions.push(
      this.plateFormatService.selectedPlate$.subscribe((plate) => {
        console.log('print-head-card-component received: ', plate);
        this._selectedPlate = plate;
        this.onGetSelectedPlateChange(plate);
      })
    );

    // this.printHeadStateService.loadDefaultPrintHeads(1);

  }

  ngOnInit() {
    // console.warn('Printhead in app-printhead-card-component:', this.printhead);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      const change = changes[propName];
      const previousValue = JSON.stringify(change.previousValue);
      const currentValue = JSON.stringify(change.currentValue);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onPrintPositionColorChange(printHead: PrintHead, color: string){
    this.printHeadStateService.updateColor(printHead.index, color);
  }

  onPrintHeadTemperatureChange(selectedTemperature: number) {
    // this.printHeadStateService.updateTemperature(printHeadIndex, temperature);
  }

  onNeedleChange(printHead: PrintHead, needle: Needle) {
    this.printHeadStateService.updateNeedle(printHead, needle);
    this.updateButtonsSize(printHead, this._selectedPlate.well_sizeMM, printHead.needle.odMM);
  }
  onGetSelectedPlateChange(selectedPlate: PlateFormat) {
    if (!this.printhead) { // Replace this.printHeads.length < 1 with !this.printhead
      this.printHeadStateService.loadDefaultPrintHeads(1);

      this.updateButtonsSize(this.printhead, selectedPlate.well_sizeMM, this.selectedNeedle.odMM); // Replace printHead with this.printhead
    } else {
      this.updateButtonsSize(this.printhead, selectedPlate.well_sizeMM, this.printhead.needle.odMM); // Replace printHead with this.printhead
    }
  }

  updateButtonsSize(printHead: PrintHead, plateMapWellSize: number, needleOdMM: number) {
    // this.printPositionService.getNewButtonsSize('print-head', printHead, plateMapWellSize, needleOdMM);
  }

  toPX(size_in_mm:number): number {
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  getPrintPickerWidthPX() {
    return (this.toPX(this.printPositionService.PRINT_PICKER_DIAM_MM));
  }

  onPrintHeadTypeChange(printhead: PrintHead, newPrintHeadType: PrintHeadBehavior): void {
    // Add your logic here to handle the change in the selected print head type
    console.log('Selected Print Head Type:', newPrintHeadType);
  }
  onNeedleChanged(needle: any) {
    this.selectedNeedle = needle;
    // You can pass the needle to other child components through input bindings
  }

  onColorChanged(selectedColor: string) {
    this.selectedColor = selectedColor;
  }
}

