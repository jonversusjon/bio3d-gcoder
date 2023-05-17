import {
  Component,
  OnInit,
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
  @Input() wellDiamMM!: number;

  selectedNeedle!: Needle;
  selectedColor!: string;
  buttonWidthPX!: number;

  description:string = '';

  constructor(
    private screenUtils: ScreenUtils,
    private printHeadStateService: PrintHeadStateService,
    ) {
  }

  ngOnInit() {
    this.selectedPrintheadTool = availablePrintheadTools[0];
    this.selectedNeedle = needles[0];
    this.selectedColor = this.printhead.color;
    this.buttonWidthPX = this.printhead.buttonWidthPX;

    let printHeadProperties: Partial<Printhead> = {
      tool: availablePrintheadTools[0],
      needle: needles[0],
      color: this.printhead.color,
      buttonWidthPX: this.printhead.buttonWidthPX
    };

    this.printHeadStateService.updatePrintHeadProperties(
      this.printhead,
      printHeadProperties
    );

    this.printHeadStateService.printHeads$.subscribe(printHeads => {
      this.selectedColor = printHeads[this.printheadIndex].color;
      this.buttonWidthPX = printHeads[this.printheadIndex].buttonWidthPX;
    });
  }


  onPrintHeadTemperatureChange(selectedTemperature: number) {
    // this.printHeadStateService.updateTemperature(printHeadIndex, temperature);
  }

  onDescriptionChange(printheadIndex: number, newDescription: string) {
    this.description = newDescription;
    this.printHeadStateService.updatePrintHeadProperty(printheadIndex, 'description', newDescription);
  }
  OnToggleChange(isChecked: boolean) {
    this.printHeadStateService.updatePrintHeadProperty(this.printhead.index, 'active', isChecked);
  }
  onPrintHeadToolChange(newPrintheadTool: PrintheadTool) {
    this.selectedPrintheadTool = newPrintheadTool;
    this.printHeadStateService.updatePrintHeadProperty(this.printheadIndex, 'tool', newPrintheadTool);
  }

  onColorChanged(newColor: string) {
    this.selectedColor = newColor;
    this.printHeadStateService.updatePrintHeadProperty(this.printheadIndex, 'color', newColor);
  }

}

