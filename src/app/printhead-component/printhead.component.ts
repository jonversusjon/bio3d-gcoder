import {
  Component,
  OnDestroy,
  OnInit
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

@Component({
  selector: 'app-printhead-component',
  templateUrl: './printhead.component.html',
  styleUrls: ['./printhead.component.css']
})
export class PrintheadComponent implements OnInit, OnDestroy {

  public customButtonToggleStyle: any;

  private printPositionOriginsMM: Coordinates[] = [];

  inactiveColor = '#808080';

  needles:Needle[] = []
  printHeads: PrintHead[] = []
  printHeadCountInput: number = 1;

  _selectedPlate: PlateFormat | null = null;

  activeToggle: boolean = false;

  constructor(
    private screenUtils: ScreenUtils,
    private printHeadStateService: PrintHeadStateService,
    private styleService: StyleService,
    private plateFormatService: PlateFormatService,
    private printPositionService: PrintPositionService,
    ) {
      const defaultPlateFormat =  this.plateFormatService.plateFormats[0];
      this.printPositionOriginsMM = this.printPositionService.getPrintPositionOriginsMM("print-head", defaultPlateFormat.well_sizeMM);

    this.plateFormatService.selectedPlate$.subscribe((plate) => {
      this._selectedPlate = plate
      this.onGetSelectedPlateChange(plate);
    });

    this.printHeadStateService.printHeads$.subscribe((printHeads: PrintHead[]) => {
      this.printHeads = printHeads;
      for (const printHead of printHeads) {
        // this.buttonWidthsPX[printHead.printHeadIndex] = this.toPX(this.printPositionService.getButtonWidthMM(printHead));
      }
      // console.log('this.printHeadStateService.printHeads$ buttonwidthspx: ', this.buttonWidthsPX);
    });
    //
    // // this.printPositionCoordinates$ = printHeadStateService.printPositionCoordinates$;
    //
    this.needles = this.printHeadStateService.needles;
  }

  ngOnInit() {
    this.onPrintHeadCountChange();
    this.customButtonToggleStyle = this.styleService.getBaseStyle('custom-button-toggle');

    // this.buttonWidthsPX[0] = this.printPositionService.getButtonWidthMM(this.printHeads[0]);

    this.printHeadStateService.updatePrintHeadNeedle(this.printHeads[0], this.needles[0]);

  }

  ngOnDestroy() {
  }

  onGetSelectedPlateChange(selectPlate: PlateFormat | null) {
    this.updateAllPrintHeadButtonSizes(this.printHeads);
  }

  onActiveToggleChange(event: MatSlideToggleChange) {
    this.activeToggle = event.checked;
  }
  onPrintPositionButtonChange(printHead: PrintHead, buttonIndex?: number, updateAll: boolean = false){
    console.log('time to change some button sizes');
  }

  toggleButton(printHead: PrintHead, printHeadButton:PrintHeadButton) {
    this.printHeadStateService.toggleButton(printHead, printHeadButton);
  }

  onNeedleChange(printHead: PrintHead, needle: Needle) {
    this.printHeadStateService.updatePrintHeadNeedle(printHead, needle);
    // this.printPositionService.getButtonWidthMM(printHead, 'print-head');
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
    this.printHeadStateService.updatePrintHeadsCount(this.printHeadCountInput);
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


  // Maybe try separate functions for each calculated style value
  getStylePrintPositionButton(printHead: PrintHead, printHeadButton: PrintHeadButton) {
    const buttonSizePX = this.getPrintPositionButtonWidthPX(printHead.needle.odMM);
    let topPX = this.getButtonTopPX(printHeadButton.position) - (buttonSizePX/2);
    let lfPX = this.getButtonLeftPX(printHeadButton.position) - (buttonSizePX/2);
    const buttonColor = printHead.active? (printHeadButton.selected ? printHead.color : 'white') : '#f1f1f1';

    return {
      ...this.customButtonToggleStyle,
         'width': buttonSizePX + 'px',
         'top': topPX + 'px',
         'left': lfPX + 'px',
         'background-color': buttonColor
    };
  }

  getPrintPositionButtonWidthPX(needleOdMM: number) {
    const plateMapWellDiamMM = this._selectedPlate?.well_sizeMM;
    return this.toPX(this.printPositionService.getButtonWidthMM('print-head', needleOdMM, plateMapWellDiamMM));
  }
  getButtonLeftPX(printHeadButtonPosition: number) {
    return this.toPX(this.printPositionService.getButtonLeftMM(this.printPositionOriginsMM, printHeadButtonPosition));
  }

  getButtonTopPX(printHeadButtonPosition: number) {
    return this.toPX(this.printPositionService.getButtonTopMM(this.printPositionOriginsMM, printHeadButtonPosition));
  }

  getStylePrintPositionPicker(printHead: PrintHead) {
    const mergedPrintPickerStyle =
      {
        ...this.customButtonToggleStyle,
        'width': (this.getPrintPickerWidthPX(printHead)) + 'px',
        'bottom-margin': '8px'
      }
    return mergedPrintPickerStyle;
  }

}

