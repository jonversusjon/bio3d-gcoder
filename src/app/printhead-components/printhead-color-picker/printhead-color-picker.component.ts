import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Printhead} from "../../../types/Printhead";
import {INACTIVE_COLOR} from "../../_services/style.service";
import {PrintHeadStateService} from "../../_services/print-head-state.service";

@Component({
  selector: 'app-printhead-color-picker',
  templateUrl: './printhead-color-picker.component.html',
  styleUrls: ['./printhead-color-picker.component.css']
})
export class PrintheadColorPickerComponent {
  @Input() printhead!: Printhead;
  @Input() printheadIndex!: number;

  inactiveColor = INACTIVE_COLOR;
  selectedColor!: string;
  constructor(private printHeadStateService: PrintHeadStateService,) {

  }

  colorChangedEvent(color: string) {
    this.selectedColor = color;
    this.printHeadStateService.updatePrintHeadProperty(this.printheadIndex, 'color', color);
  }

}
