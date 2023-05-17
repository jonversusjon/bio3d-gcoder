import {ChangeDetectorRef, Input, Component, OnDestroy} from '@angular/core';
import {StyleService} from "../../_services/style.service";
import {PrintPositionService} from "../../_services/print-position.service";
import {Subscription} from "rxjs";
import {Printhead} from "../../../types/Printhead";
import {PrintPosition} from "../../../types/PrintPosition";
import {PrintHeadStateService} from "../../_services/print-head-state.service";
import {Needle} from "../../../types/Needle";
import {ScreenUtils} from "../../_services/screen-utils";

@Component({
  selector: 'app-print-position-picker',
  templateUrl: './print-position-picker.component.html',
  styleUrls: ['./print-position-picker.component.css']
})
export class PrintPositionPickerComponent implements OnDestroy {
  @Input() printhead!: Printhead;
  @Input() selectedNeedle!: Needle;
  @Input() color!: string;
  @Input() buttonWidthPX!: number;

  private subscriptions: Subscription[] = [];

  printPositionButtonBaseStyle = {};
  _printPositionService: any;
  constructor(private styleService: StyleService,
              public printPositionService: PrintPositionService,
              private changeDetectorRef: ChangeDetectorRef,
              private printHeadStateService: PrintHeadStateService,
              private screenUtils: ScreenUtils){

    this.printPositionButtonBaseStyle = this.styleService.getBaseStyle('print-position-button');
    this._printPositionService = printPositionService;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }




  togglePrintHeadButton(printHead: Printhead, printHeadButton:PrintPosition) {
    this.printHeadStateService.toggleButtonStatus(printHead.index, printHeadButton.index);
  }
  getStylePrintPositionButton(printHead: Printhead, buttonIndex: number) {
    const baseStyle = this.styleService.getBaseStyle('print-position-button');

    return {
      ...baseStyle,
      'width': this.printPositionService.printPositionButtonWidthPX + 'px',
      'top': this.printPositionService.printPositionButtonTopsPX[buttonIndex] + 'px',
      'left': this.printPositionService.printPositionButtonLeftsPX[buttonIndex] + 'px'
    };
  }

  getStylePrintPositionPicker() {
    return {
      ...this.styleService.getBaseStyle('well'),
      width: this.getPrintPickerWidthPX() + 'px'
    };
  }
  getPrintPickerWidthPX() {
    return (this.toPX(this.printPositionService.PRINT_PICKER_DIAM_MM));
  }

  toPX(size_in_mm:number): number {
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

}

