import {Component, Input} from '@angular/core';
import {PrintheadTool} from "../../../types/PrintheadTool";
import {Printhead} from "../../../types/Printhead";
import {PrintHeadStateService} from "../../_services/print-head-state.service";
import {Needle} from "../../../types/Needle";
import {PrintPositionService} from "../../_services/print-position.service";
import {ScreenUtils} from "../../_services/screen-utils";

@Component({
  selector: 'app-printhead-tool-options',
  templateUrl: './printhead-tool-options.component.html',
  styleUrls: ['./printhead-tool-options.component.css']
})
export class PrintheadToolOptionsComponent {
  @Input() printhead!: Printhead;
  @Input() printheadIndex!: number;
  @Input() selectedPrintheadTool!: PrintheadTool;
  @Input() well_diamMM!: number;

  public wavelength!: number;
  emdMode!: string;

  constructor(private printHeadStateService: PrintHeadStateService,
              private printPositionService: PrintPositionService,
              private screenUtils: ScreenUtils) {
  }
  onNeedleChanged(newNeedle: Needle) {
    let newButtonWidthPX = this.toPX(this.printPositionService.getButtonWidthMM(
      "PrintHead",
      this.well_diamMM,
      newNeedle.odMM));

    this.printHeadStateService.updatePrintHeadProperties(
      this.printhead,
      {
        buttonWidthPX: newButtonWidthPX,
        needle: newNeedle
      }
    );
  }

  toPX(size_in_mm: number, message?: string) {
    return this.screenUtils.convertMMToPX(size_in_mm, message);
  }
}
