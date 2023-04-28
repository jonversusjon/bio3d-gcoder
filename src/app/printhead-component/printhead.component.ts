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
import {Coordinates} from "../../types/Coordinates";
import {Needle} from "../../types/Needle";
import {StyleService} from "../_services/style.service";
import { PlateFormatService } from "../_services/plate-format.service";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {PrintPositionService} from "../_services/print-position.service";
import {BehaviorSubject, Subscription} from "rxjs";

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
        // ...
      })
    );

    this.needles = this.printHeadStateService.needles;
  }

  ngOnInit() {
    this.printHeadStateService.printHeads$.subscribe(printHeads => {
      console.log('printhead-component notified of printheads change');
      this.printHeads = printHeads;
    });
    this.printHeadStateService.generateDefaultPrintHeads(1);
    this.printHeadStateService.updateNeedle(this.printHeads[0].printHeadIndex, this.needles[0]);

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


  onGetSelectedPlateChange(selectPlate: PlateFormat) {
    this.updateAllPrintHeadButtonSizes(this.printHeads);
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
    this.updateAllPrintHeadButtonSizes([printHead]);
  }
  updateAllPrintHeadButtonSizes(printHeads: PrintHead[]) {
    if(this._selectedPlate) {
      for (const printHead of printHeads) {
        const printPositionSizeMM = this.printPositionService.getButtonWidthMM(
          "print-head", printHead.needle.odMM, this._selectedPlate?.well_sizeMM)

        const radius = printPositionSizeMM/2;
        const printPositionOriginsMM = this.printPositionService.getPrintPositionOriginsMM(
          "print-head", this._selectedPlate?.well_sizeMM, -radius, -radius)

        for (const button of printHead.printPositionButtons) {
          // const newPrintPositionButonStyle = this.getMergedPrintPositionStyles(this.printPositionOriginsMM, button.position, printPositionSizeMM);
          // button.style = newPrintPositionButonStyle;
        }
      }
    } else {
      console.warn("Printhead component unable to update all printHead button sizes; no selected plate;");
    }
  }

  onPrintHeadCountChange() {
    console.log('onPrintHeadHeadCountChange triggered');
    this.printHeadStateService.generateDefaultPrintHeads(this.printHeadCountInput);
    this.updateAllPrintHeadButtonSizes(this.printHeads);
  }

  toPX(size_in_mm:number, scale=1) {
    if(scale && scale != 1) {
      size_in_mm = size_in_mm * scale;
    }
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  getPrintPickerWidthPX(printHead: PrintHead) {
    return (this.toPX(this.printPositionService.PRINT_PICKER_DIAM_MM));
  }

  getStylePrintPositionPicker(printHead: PrintHead) {
    const mergedPrintPickerStyle =
      {
        ...this.styleService.getBaseStyle('custom-button-toggle'),
        'width': (this.getPrintPickerWidthPX(printHead)) + 'px',
        'bottom-margin': '8px'
      }
    return mergedPrintPickerStyle;
  }


}

