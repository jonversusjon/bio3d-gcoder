import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { PlateFormat } from "../../types/PlateFormat";
import { ScreenUtils } from "../_services/screen-utils";
import { PrintHeadStateService } from "../_services/print-head-state.service"
import { PrintHead } from "../../types/PrintHead";
import { PrintHeadButton } from "../../types/PrintHeadButton";
import {Observable, Subscription} from "rxjs";
import {Coordinates} from "../../types/Coordinates";
import {Needle} from "../../types/Needle";
import {StyleService} from "../_services/style.service";
import { PlateFormatService } from "../_services/plate-format.service";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-printhead-component',
  templateUrl: './printhead.component.html',
  styleUrls: ['./printhead.component.css']
})
export class PrintheadComponent implements OnInit, OnDestroy {

  public customButtonToggleStyle: any;

  printPositionCoordinates$!: Observable<Coordinates[]>;

  printPickerSizeMM: number = 34.8;
  inactiveColor = '#808080';

  needles:Needle[] = []
  printHeads: PrintHead[] = []
  printHeadCountInput: number = 1;
  buttonWidthsPX:number[] = []

  _selectedPlate: PlateFormat | null = null;

  activeToggle: boolean = false;

  constructor(
    private screenUtils: ScreenUtils,
    private printHeadStateService: PrintHeadStateService,
    private cd: ChangeDetectorRef,
    private styleService: StyleService,
    private plateFormatService: PlateFormatService) {

    this.plateFormatService.selectedPlate$.subscribe((plate) => {
      console.log('print head component is aware of a plate change');
      this._selectedPlate = plate;
      this.onGetSelectedPlateChange(plate);
    });

    this.printHeadStateService.printHeads$.subscribe((printHeads: PrintHead[]) => {
      this.printHeads = printHeads;
      for (const printHead of printHeads) {
        this.buttonWidthsPX[printHead.printHeadIndex] = this.toPX(this.printHeadStateService.getButtonWidthMM(printHead));
      }
      console.log('this.printHeadStateService.printHeads$ buttonwidthspx: ', this.buttonWidthsPX);
    });

    this.printPositionCoordinates$ = printHeadStateService.printPositionCoordinates$;

    this.needles = this.printHeadStateService.needles;
  }

  ngOnInit() {
    this.onPrintHeadCountChange();
    this.customButtonToggleStyle = this.styleService.getBaseStyle('custom-button-toggle');
    this.buttonWidthsPX = new Array(this.printHeadCountInput).fill(0);
    this.buttonWidthsPX[0] = this.printHeadStateService.getButtonWidthMM(this.printHeads[0]);
    this.printHeadStateService.updatePrintHeadNeedle(this.printHeads[0], this.needles[0]);

  }

  ngOnDestroy() {
  }

  // getButtonWidthPX(printhead: PrintHead) {
  //   const scalar = this.getScalar(this.printHeadStateService.getButtonWidthMM(printhead))
  //   const buttonWidthMM = this.printHeadStateService.getButtonWidthMM(printhead)*scalar;
  //   printhead.buttonWidthMM = buttonWidthMM;
  //   return this.toPX(buttonWidthMM);
  // }

  onGetSelectedPlateChange(selectPlate: PlateFormat | null) {

    this.updateAllPrintHeadButtonSizes();

  }
  getButtonLeftPX(printHead: PrintHead, printHeadButtonPosition: number) {
    const scalar = this.getScalar(this.buttonWidthsPX[printHead.printHeadIndex]);
    return this.toPX(this.printHeadStateService.getButtonLeftMM(printHead, printHeadButtonPosition)*scalar);
  }

  getButtonTopPX(printHead: PrintHead, printHeadButtonPosition: number) {
    const scalar = this.getScalar(this.buttonWidthsPX[printHead.printHeadIndex]);
    return this.toPX(this.printHeadStateService.getButtonTopMM(printHead, printHeadButtonPosition)*scalar);
  }

  onActiveToggleChange(event: MatSlideToggleChange) {
    this.activeToggle = event.checked;
  }
  onPrintPositionButtonChange(printHead: PrintHead, buttonIndex?: number, updateAll: boolean = false){
    console.log('time to change some button sizes');
  }

  toggleButton(printhead: PrintHead, printHeadButton:PrintHeadButton) {
    this.printHeadStateService.toggleButton(printhead, printHeadButton);
  }

  // updatePrintHeadStateService(printHead[]: PrintHead) {
  //   const selectedButtons = printHead.printPositionButtons.filter((button: PrintHeadButton, index: number) => {
  //     return printHead.printPositionButtons[index].selected;
  //   }).map((button: any) => ({ ...button, color: printHead.color }));
  // this.printHeadStateService.updatePrintHeads(printHead);
  //
  // }
  updatePrintHeadNeedle(printHead: PrintHead, needle: Needle) {
    this.printHeadStateService.updatePrintHeadNeedle(printHead, needle);
    this.buttonWidthsPX[printHead.printHeadIndex] = this.toPX(this.printHeadStateService.getButtonWidthMM(printHead));

    this.updateAllPrintHeadButtonSizes();
  }
  updateAllPrintHeadButtonSizes() {

    for (const printHead of this.printHeads) {
      for (const button of printHead.printPositionButtons ) {
        const newStyle = this.getMergedStyles(printHead, button)
        button.style = newStyle;
      }
    }
  }

  onPrintHeadCountChange() {
    this.printHeadStateService.updatePrintHeadsCount(this.printHeadCountInput);
    this.updateAllPrintHeadButtonSizes();
  }
  getScalar(size_in_mm: number) {
    return 1;
  }
  toPX(size_in_mm:number, scale=1) {
    if(scale && scale != 1) {
      size_in_mm = size_in_mm * scale;
    }
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  getPrintPickerWidthPX(printHead: PrintHead) {
    const scalar = this.getScalar(this.printHeadStateService.getButtonWidthMM(printHead))
    return (this.toPX(this.printPickerSizeMM)*scalar);
  }

  getMergedStyles(printHead: PrintHead, button: PrintHeadButton) {
    const wdPX = this.buttonWidthsPX[printHead.printHeadIndex];
    const tpPX = this.getButtonTopPX(printHead, button.position)// - (wdPX/2);
    const lfPX = this.getButtonLeftPX(printHead, button.position)// - (wdPX/2)
    const buttonColor = printHead.active? (button.selected ? printHead.color : 'white') : '#f1f1f1';
    const mergedStyle =
     {
      ...this.customButtonToggleStyle,
       'width': wdPX + 'px',
      'top': tpPX + 'px',
      'left': lfPX+ 'px',
       'background-color': buttonColor
    };
    return mergedStyle;
  }

  getPrintPositionPickerStyle(printHead: PrintHead) {
    const mergedStyle =
      {
        ...this.customButtonToggleStyle,
        'width': (this.getPrintPickerWidthPX(printHead)) + 'px',
        'bottom-margin': '8px'
      }
    return mergedStyle;
  }

}

