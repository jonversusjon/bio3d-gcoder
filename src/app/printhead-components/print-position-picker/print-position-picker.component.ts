import {ChangeDetectorRef, Input, Component, OnDestroy} from '@angular/core';
import {StyleService} from "../../_services/style.service";
import {PrintPositionService} from "../../_services/print-position.service";
import {Subscription} from "rxjs";
import {Printhead} from "../../../types/Printhead";
import {PrintPosition} from "../../../types/PrintPosition";
import {PrintHeadStateService} from "../../_services/print-head-state.service";
import {Needle} from "../../../types/Needle";

@Component({
  selector: 'app-print-position-picker',
  templateUrl: './print-position-picker.component.html',
  styleUrls: ['./print-position-picker.component.css']
})
export class PrintPositionPickerComponent implements OnDestroy {
  @Input() printhead!: Printhead;
  @Input() selectedNeedle!: Needle;
  @Input() selectedColor!: string;
  private subscriptions: Subscription[] = [];

  printPositionButtonBaseStyle = {};
  _printPositionService: any;
  constructor(private styleService: StyleService,
              public printPositionService: PrintPositionService,
              private changeDetectorRef: ChangeDetectorRef,
              private printHeadStateService: PrintHeadStateService){

    this.printPositionButtonBaseStyle = this.styleService.getBaseStyle('print-position-button');
    this._printPositionService = printPositionService;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getStylePrintPositionPicker() {
    return {
      ...this.styleService.getBaseStyle('well')
    };
  }


  togglePrintHeadButton(printHead: Printhead, printHeadButton:PrintPosition) {
    this.printHeadStateService.toggleButtonStatus(printHead.index, printHeadButton.index);
  }
  getStylePrintPositionButton(printHead: Printhead, buttonIndex: number) {
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

}

