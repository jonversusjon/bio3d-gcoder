import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Printhead} from "../../../types/Printhead";
import {INACTIVE_COLOR} from "../../_services/style.service";
import {PrintHeadStateService} from "../../_services/print-head-state.service";
import {PrintheadTool} from "../../../types/PrintheadTool";

@Component({
  selector: 'app-printhead-color-picker',
  templateUrl: './printhead-color-picker.component.html',
  styleUrls: ['./printhead-color-picker.component.css']
})
export class PrintheadColorPickerComponent {
  @Input() printhead!: Printhead;
  @Input() printheadIndex!: number;
  @Input() selectedColor!: string;
  @Output() colorChanged = new EventEmitter<string>();

  inactiveColor = INACTIVE_COLOR;

  constructor(private printHeadStateService: PrintHeadStateService,) {

  }

  colorSelected(newColor: string) {
    this.selectedColor = newColor;
    this.printHeadStateService.updatePrintHeadProperty(this.printheadIndex, 'color', newColor);
  }
  onColorChanged(newColor: string) {
    this.selectedColor = newColor;
    this.colorChanged.emit(newColor);
  }

}
