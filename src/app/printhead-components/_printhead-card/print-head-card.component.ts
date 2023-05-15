import {
  Component, OnChanges,
  OnDestroy,
  OnInit, SimpleChanges,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { ScreenUtils } from "../../_services/screen-utils";
import { PrintHeadStateService } from "../../_services/print-head-state.service"
import {Printhead} from "../../../types/Printhead";
import {Needle, needles} from "../../../types/Needle";
import {StyleService} from "../../_services/style.service";
import { PlateFormatService } from "../../_services/plate-format.service";
import {PrintPositionService} from "../../_services/print-position.service";
import {PrintheadTool,availablePrintheadTools} from "../../../types/PrintheadTool";

@Component({
  selector: 'app-printhead-card-component',
  templateUrl: './print-head-card.component.html',
  styleUrls: ['./print-head-card.component.css'],
})

export class PrintHeadCardComponent implements OnInit {
  @Input() printhead!: Printhead;
  @Input() printheadIndex!: number;
  @Input() selectedPrintheadTool!: PrintheadTool;

  selectedNeedle!: Needle;
  selectedColor!: string;

  constructor(
    private screenUtils: ScreenUtils,
    private printHeadStateService: PrintHeadStateService,
    private styleService: StyleService,
    private plateFormatService: PlateFormatService,
    private printPositionService: PrintPositionService) {
  }

  ngOnInit() {
    this.selectedPrintheadTool = availablePrintheadTools[0];
    this.selectedNeedle = needles[0];
  }

  onPrintHeadTemperatureChange(selectedTemperature: number) {
    // this.printHeadStateService.updateTemperature(printHeadIndex, temperature);
  }

  onDescriptionChange(printheadIndex: number, newDescription: string) {
    this.printHeadStateService.updatePrintHeadProperty(printheadIndex, 'description', newDescription);
  }
  OnToggleChange(isChecked: boolean) {
    this.printHeadStateService.updatePrintHeadProperty(this.printhead.index, 'active', isChecked);
  }

  toPX(size_in_mm:number): number {
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  getPrintPickerWidthPX() {
    return (this.toPX(this.printPositionService.PRINT_PICKER_DIAM_MM));
  }

  onPrintHeadToolChange(newPrintheadTool: PrintheadTool) {
    this.selectedPrintheadTool = newPrintheadTool;

    console.log(' --print-head-card-component -- onPrintHeadToolChange');
    console.log('selectedPrintheadTool: ', newPrintheadTool);
    console.log('newPrintHeadTool.behavior: ', newPrintheadTool.behavior);
  }
}

