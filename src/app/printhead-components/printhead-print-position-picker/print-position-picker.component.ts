import {ChangeDetectorRef, Input, Component, ElementRef} from '@angular/core';
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
export class PrintPositionPickerComponent {
  @Input() printhead!: Printhead;
  @Input() selectedNeedle!: Needle;
  @Input() color!: string;
  @Input() buttonWidthPX!: number;

  printPositionButtonBaseStyle = {};
  _printPositionService: any;
  constructor(private styleService: StyleService,
              public printPositionService: PrintPositionService,
              private changeDetectorRef: ChangeDetectorRef,
              private printHeadStateService: PrintHeadStateService,
              private elementRef: ElementRef,
              ){

    this.printPositionButtonBaseStyle = this.styleService.getBaseStyle('print-position-button');
    this._printPositionService = printPositionService;
  }

  togglePrintHeadButton(printHead: Printhead, printHeadButton:PrintPosition) {
    this.printHeadStateService.toggleButtonStatus(printHead.index, printHeadButton.index);
  }

  getStylePrintPositionPicker() {
    return {
      ...this.styleService.getBaseStyle('well'),
    };
  }

  getButtonWidth(printPosition: PrintPosition) {
    let width = printPosition.button.widthPCT;
    return width + '%'; // return the result as a string in px
  }


}

