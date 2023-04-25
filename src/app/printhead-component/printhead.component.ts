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

@Component({
  selector: 'app-printhead-component',
  templateUrl: './printhead.component.html',
  styleUrls: ['./printhead.component.css']
})
export class PrintheadComponent implements OnInit, OnDestroy {
  @Input() printHeadChanged!: PrintHead;

  public customButtonToggleStyle: any;

  private plateFormatChangedSubscription: Subscription = new Subscription();
  private selectedPlate!: PlateFormat;
  printPositionCoordinates$!: Observable<Coordinates[]>;

  printPickerSizeMM: number = 34.8;
  inactiveColor = '#808080';

  needles:Needle[] = []
  printHeads: PrintHead[] = []
  printHeadCountInput: number = 1;

  constructor(
    private screenUtils: ScreenUtils,
    private printHeadStateService: PrintHeadStateService,
    private cd: ChangeDetectorRef,
    private styleService: StyleService,
    private plateFormatService: PlateFormatService) {

    this.printHeadStateService.printHeads$.subscribe((printheads: PrintHead[]) => {
      this.printHeads = printheads;
      console.log('print-head-component received printheads: ', printheads);
    });

    this.printPositionCoordinates$ = printHeadStateService.printPositionCoordinates$;
    this.plateFormatChangedSubscription = this.plateFormatService.selectedPlate$.subscribe(plate => {
      if (plate) {
        this.selectedPlate = plate;
        this.printHeadStateService.emitPrintHeads();
      }
    });
    this.needles = this.printHeadStateService.needles;
  }

  ngOnInit() {
    this.onPrintHeadCountChange();
    this.cd.detectChanges();
    this.customButtonToggleStyle = this.styleService.getBaseStyle('custom-button-toggle');
  }

  ngOnDestroy() {
    this.plateFormatChangedSubscription.unsubscribe();
  }

  getButtonWidthPX(printhead: PrintHead) {
    const scalar = this.getScalar(this.printHeadStateService.getButtonWidthMM(printhead))
    const buttonWidthMM = this.printHeadStateService.getButtonWidthMM(printhead)*scalar;
    printhead.buttonWidthMM = buttonWidthMM;
    return this.toPX(buttonWidthMM);
  }
  getButtonLeftPX(printHead: PrintHead, printHeadButtonPosition: number) {
    const scalar = this.getScalar(this.printHeadStateService.getButtonWidthMM(printHead))
    return this.toPX(this.printHeadStateService.getButtonLeftMM(printHead, printHeadButtonPosition)*scalar);
  }

  getButtonTopPX(printHead: PrintHead, printHeadButtonPosition: number) {
    const scalar = this.getScalar(this.printHeadStateService.getButtonWidthMM(printHead))
    return this.toPX(this.printHeadStateService.getButtonTopMM(printHead, printHeadButtonPosition)*scalar);
  }

  onPrintPositionButtonChange(printHead: PrintHead, buttonIndex?: number, updateAll: boolean = false){

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
    this.printHeadStateService.emitPrintHeads();
    this.cd.markForCheck();
  }
  onPrintHeadCountChange() {
    this.printHeadStateService.updatePrintHeadsCount(this.printHeadCountInput);
    this.cd.markForCheck();
    console.log('this.printHeads: ', this.printHeads);
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
    const mergedStyle =
     {
      ...this.customButtonToggleStyle,
      'width': (this.getButtonWidthPX(printHead)) + 'px',
      'top': (this.getButtonTopPX(printHead, button.position)) + 'px',
      'left': (this.getButtonLeftPX(printHead, button.position)) + 'px',
       'background-color': button.selected ? printHead.color : 'white'
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

