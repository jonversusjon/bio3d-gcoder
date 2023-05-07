import {ChangeDetectorRef, Input, Component, Output, OnDestroy} from '@angular/core';
import {StyleService} from "../_services/style.service";
import {PrintPositionService} from "../_services/print-position.service";
import {Subscription} from "rxjs";
import {PrintHead} from "../../types/PrintHead";
import {PrintPosition} from "../../types/PrintPosition";
import {PrintHeadStateService} from "../_services/print-head-state.service";
import {Needle} from "../../types/Needle";

@Component({
  selector: 'app-print-position-picker',
  templateUrl: './print-position-picker.component.html',
  styleUrls: ['./print-position-picker.component.css']
})
export class PrintPositionPickerComponent implements OnDestroy {
  @Input() printhead!: PrintHead;
  @Input() selectedNeedle!: Needle;
  @Input() selectedColor!: string;
  private subscriptions: Subscription[] = [];

  printPositionButtonBaseStyle = {};
  _printPositionService: any;
  constructor(private styleService: StyleService,
              public printPositionService: PrintPositionService,
              private changeDetectorRef: ChangeDetectorRef,
              private printHeadStateService: PrintHeadStateService){
    this.subscriptions.push(
      this.printPositionService.buttonWidthChanged.subscribe(() => {
        this.changeDetectorRef.markForCheck();
      })
    );
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


  togglePrintHeadButton(printHead: PrintHead, printHeadButton:PrintPosition) {
    this.printHeadStateService.toggleButtonStatus(printHead.printHeadIndex, printHeadButton.index);
  }


}

