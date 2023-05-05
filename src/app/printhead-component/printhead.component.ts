import {
  Component, OnChanges,
  OnDestroy,
  OnInit, SimpleChanges,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { PlateFormat } from "../../types/PlateFormat";
import { ScreenUtils } from "../_services/screen-utils";
import { PrintHeadStateService } from "../_services/print-head-state.service"
import { PrintHead } from "../../types/PrintHead";
import { PrintPosition } from "../../types/PrintPosition";
import {Needle} from "../../types/Needle";
import {StyleService} from "../_services/style.service";
import { PlateFormatService } from "../_services/plate-format.service";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {PrintPositionService} from "../_services/print-position.service";
import {Subscription} from "rxjs";
import {availablePrintHeads, PrintHeadBehavior} from "../../types/PrintHeadBehavior";

@Component({
  selector: 'app-print-head-component',
  templateUrl: './print-head.component.html',
  styleUrls: ['./print-head.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintHeadComponent implements OnInit, OnDestroy, OnChanges {
  public availablePrintHeads: PrintHeadBehavior[] = [];
  private subscriptions: Subscription[] = [];

  inactiveColor = '#808080';

  needles:Needle[] = []
  printHeads: PrintHead[] = []
  printHeadCountInput: number = 1;

  _selectedPlate!: PlateFormat;

  activeToggle: boolean = false;

  printPositionButtonBaseStyle = {};
  _printPositionService: any;

  public experimentSetupHeaderStyle: any;

  selectedPrintHeadType: PrintHeadBehavior;
  constructor(
    private screenUtils: ScreenUtils,
    private printHeadStateService: PrintHeadStateService,
    private styleService: StyleService,
    private plateFormatService: PlateFormatService,
    public printPositionService: PrintPositionService,
    private changeDetectorRef: ChangeDetectorRef,
    ) {

    this.subscriptions.push(
      this.plateFormatService.selectedPlate$.subscribe((plate) => {
        this._selectedPlate = plate;
        this.onGetSelectedPlateChange(plate);
      })
    );
    this.subscriptions.push(
      this.printHeadStateService.printHeads$.subscribe((printHeads: PrintHead[]) => {
        this.printHeads = printHeads;
      })
    );
    this.subscriptions.push(
      this.printPositionService.buttonWidthChanged.subscribe(() => {
        this.changeDetectorRef.markForCheck();
      })
    );
    this.printPositionButtonBaseStyle = this.styleService.getBaseStyle('print-position-button');
    this._printPositionService = printPositionService;
    this.needles = this.printHeadStateService.needles;

    this.selectedPrintHeadType = availablePrintHeads[0];
  }

  ngOnInit() {
    this.printHeadStateService.printHeads$.subscribe(printHeads => {
      console.log('printhead-component notified of printheads change');
      this.printHeads = printHeads;
      console.log('this.printHeads: ', this.printHeads);
    });
    this.experimentSetupHeaderStyle = this.styleService.getBaseStyle('experiment-setup-header');
    this.availablePrintHeads = availablePrintHeads;
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      const change = changes[propName];
      const previousValue = JSON.stringify(change.previousValue);
      const currentValue = JSON.stringify(change.currentValue);

      console.log(`Property '${propName}' changed:`, {
        previousValue: previousValue,
        currentValue: currentValue,
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  onGetSelectedPlateChange(selectedPlate: PlateFormat) {
    if(this.printHeads.length < 1) {
      this.printHeadStateService.loadDefaultPrintHeads(1);
      this.printHeadStateService.updateNeedle(this.printHeads[0].printHeadIndex, this.needles[0]);
      for(let printHead of this.printHeads) {
        this.updateButtonsSize(printHead, selectedPlate.well_sizeMM, printHead.needle.odMM);
      }
    } else {
      for(let printHead of this.printHeads) {
        this.updateButtonsSize(printHead, selectedPlate.well_sizeMM, printHead.needle.odMM);
      }
    }
  }

  onActiveToggleChange(printHead: PrintHead, event: MatSlideToggleChange) {
    this.activeToggle = event.checked;
    if (!this.activeToggle) {
      this.printHeadStateService.setAllButtonsInactive(printHead.printHeadIndex);
    }
  }
  onPrintPositionColorChange(printHead: PrintHead, color: string){
    this.printHeadStateService.updateColor(printHead.printHeadIndex, color);
  }

  togglePrintHeadButton(printHead: PrintHead, printHeadButton:PrintPosition) {
    this.printHeadStateService.toggleButtonStatus(printHead.printHeadIndex, printHeadButton.index);
  }

  onNeedleChange(printHead: PrintHead, needle: Needle) {
    this.printHeadStateService.updateNeedle(printHead.printHeadIndex, needle);
    this.updateButtonsSize(printHead, this._selectedPlate.well_sizeMM, printHead.needle.odMM);
  }

  updateButtonsSize(printHead: PrintHead, plateMapWellSize: number, needleOdMM: number) {
    console.log('updateButtonsSize called with printHead: ', printHead, ' plateMapWellSize: ', plateMapWellSize, 'needleOdMM: ', needleOdMM);
    this.printPositionService.getNewButtonsSize('print-head', printHead, plateMapWellSize, needleOdMM);
  }

  onPrintHeadCountChange() {
    this.printHeadStateService.onPrintHeadCountChange(this.printHeadCountInput);
  }

  toPX(size_in_mm:number): number {
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  getPrintPickerWidthPX() {
    return (this.toPX(this.printPositionService.PRINT_PICKER_DIAM_MM));
  }

  getStylePrintPositionPicker() {
    return {
        ...this.styleService.getBaseStyle('well')
      };
  }

  getStylePrintPositionButton(printHead: PrintHead, buttonIndex: number) {
    const baseStyle = this.styleService.getBaseStyle('print-position-button');
    // console.log('new printPositionButtonWidthPX: ', this.printPositionService.printPositionButtonWidthPX + 'px');
    // console.log('new printPositionButtonTopsPX[buttonIndex]: ', this.printPositionService.printPositionButtonTopsPX[buttonIndex] + 'px');
    // console.log('new printPositionButtonLeftsPX[buttonIndex]: ', this.printPositionService.printPositionButtonLeftsPX[buttonIndex] + 'px');
    return {
      ...baseStyle,
      'width': this.printPositionService.printPositionButtonWidthPX + 'px',
      'top': this.printPositionService.printPositionButtonTopsPX[buttonIndex] + 'px',
      'left': this.printPositionService.printPositionButtonLeftsPX[buttonIndex] + 'px'
    };
  }

  onPrintHeadTypeChange(printhead: PrintHead, newPrintHeadType: PrintHeadBehavior): void {
    // Add your logic here to handle the change in the selected print head type
    console.log('Selected Print Head Type:', newPrintHeadType);
  }

}

