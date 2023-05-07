import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PrintHead} from "../../types/PrintHead";
import {INACTIVE_COLOR} from "../_services/style.service";

@Component({
  selector: 'app-printhead-color-picker',
  templateUrl: './printhead-color-picker.component.html',
  styleUrls: ['./printhead-color-picker.component.css']
})
export class PrintheadColorPickerComponent {
  @Input() printhead!: PrintHead;
  @Input() printheadIndex!: number;
  @Output() colorChanged: EventEmitter<any> = new EventEmitter<any>();

  inactiveColor = INACTIVE_COLOR;
  selectedColor!: string;
  constructor() {

  }

  colorChangedEvent(color: string) {
    this.selectedColor = color;
    this.colorChanged.emit(this.selectedColor);
  }

}
