import {
  Component, DoCheck, OnChanges,
  OnDestroy,
  OnInit, SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { PlateFormat } from "../../types/PlateFormat";
import { ScreenUtils } from "../_services/screen-utils";
import { PrintHeadStateService } from "../_services/print-head-state.service"
import { PrintHead } from "../../types/PrintHead";
import { PrintHeadButton } from "../../types/PrintHeadButton";
import {Needle} from "../../types/Needle";
import {StyleService} from "../_services/style.service";
import { PlateFormatService } from "../_services/plate-format.service";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {PrintPositionService} from "../_services/print-position.service";
import {Subscription} from "rxjs";
import {Coordinates} from "../../types/Coordinates";

@Component({
  selector: 'app-printhead-component',
  templateUrl: './printhead.component.html',
  styleUrls: ['./printhead.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintheadComponent implements OnInit, OnDestroy, OnChanges, DoCheck {
  private subscriptions: Subscription[] = [];

  inactiveColor = '#808080';

  needles:Needle[] = []
  printHeads: PrintHead[] = []
  printHeadCountInput: number = 1;

  _selectedPlate!: PlateFormat;

  activeToggle: boolean = false;

  printPositionButtonBaseStyle = {};
  printPositionButtonTopsPX:number[] = [];
  printPositionButtonLeftsPX:number[] = [];
  printPositionButtonWidthPX: number = 9;

  printPositionOriginsMM:Coordinates[] = []
  constructor(
    private screenUtils: ScreenUtils,
    private printHeadStateService: PrintHeadStateService,
    private styleService: StyleService,
    private plateFormatService: PlateFormatService,
    private printPositionService: PrintPositionService,
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
    this.printPositionButtonBaseStyle = this.styleService.getBaseStyle('print-position-button');
    this.printPositionOriginsMM = this.printPositionService.getPrintPositionOriginsMM('print-head', this.plateFormatService.getPlateFormats()[0].well_sizeMM)
    this.needles = this.printHeadStateService.needles;
  }

  ngOnInit() {
    this.printHeadStateService.printHeads$.subscribe(printHeads => {
      console.log('printhead-component notified of printheads change');
      this.printHeads = printHeads;
      console.log('this.printHeads: ', this.printHeads);
    });
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


  ngDoCheck(): void {
    // console.log('Change detection ran');
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
    }

    // this.updateAllPrintHeadButtonSizes(this.printHeads);
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

  togglePrintHeadButton(printHead: PrintHead, printHeadButton:PrintHeadButton) {
    this.printHeadStateService.toggleButtonStatus(printHead.printHeadIndex, printHeadButton.position);
  }

  onNeedleChange(printHead: PrintHead, needle: Needle) {
    this.printHeadStateService.updateNeedle(printHead.printHeadIndex, needle);
  }

  updateButtonsSize(printHead: PrintHead, plateMapWellSize: number, needleOdMM: number) {
    // Calculate the new button width, top, and width based on the needle selection
    const printPositionButtonWidthMM = this.printPositionService.getButtonWidthMM(
      'print-head', this._selectedPlate.well_sizeMM, printHead.needle.odMM);
    const calculatedButtonWidthPX = this.toPX(printPositionButtonWidthMM);
    this.printPositionButtonWidthPX = calculatedButtonWidthPX < 9 ? 9 : calculatedButtonWidthPX;
    this.printPositionButtonLeftsPX = this.printPositionOriginsMM.map(coordinate => this.toPX(coordinate.x - this.printPositionButtonWidthPX / 2));
    this.printPositionButtonTopsPX = this.printPositionOriginsMM.map(coordinate => this.toPX(coordinate.y - this.printPositionButtonWidthPX/2));
  }

  // updateAllPrintHeadButtonSizes(printHeads: PrintHead[]) {
  //   console.log('printhead.component this._selectedPlate.well_sizeMM: ', this._selectedPlate.well_sizeMM);
  //   if(this._selectedPlate) {
  //     for (const printHead of printHeads) {
  //       const printPositionSizeMM = this.printPositionService.getButtonWidthMM(
  //         "print-head", this._selectedPlate?.well_sizeMM, printHead.needle.odMM);
  //
  //       const radius = printPositionSizeMM/2;
  //       const printPositionOriginsMM = this.printPositionService.getPrintPositionOriginsMM(
  //         "print-head", this._selectedPlate?.well_sizeMM, -radius, -radius)
  //
  //       for (const button of printHead.printPositionButtons) {
  //         // const newPrintPositionButonStyle = this.getMergedPrintPositionStyles(this.printPositionOriginsMM, button.position, printPositionSizeMM);
  //         // button.style = newPrintPositionButonStyle;
  //       }
  //     }
  //   } else {
  //     console.warn("Printhead component unable to update all printHead button sizes; no selected plate;");
  //   }
  // }

  onPrintHeadCountChange() {
    this.printHeadStateService.onPrintHeadCountChange(this.printHeadCountInput);
    // this.updateAllPrintHeadButtonSizes(this.printHeads);
  }

  toPX(size_in_mm:number): number {
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  getPrintPickerWidthPX(printHead: PrintHead) {
    return (this.toPX(this.printPositionService.PRINT_PICKER_DIAM_MM));
  }

  getStylePrintPositionPicker(printHead: PrintHead) {
    const mergedPrintPickerStyle =
      {
        ...this.styleService.getBaseStyle('well'),
        'width': (this.getPrintPickerWidthPX(printHead)) + 'px',
        'bottom-margin': '8px'
      }
    return mergedPrintPickerStyle;
  }

  getStylePrintPositionButton(printHead: PrintHead, buttonIndex: number) {
    const baseStyle = this.styleService.getBaseStyle('print-position-button');
    const buttonStyle =
      {...baseStyle,
        'width': this.printPositionButtonWidthPX + 'px',
        'top': this.printPositionButtonTopsPX[buttonIndex] + 'px',
        'left': this.printPositionButtonLeftsPX[buttonIndex] + 'px'
      }
      return buttonStyle;
  }
}

