import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PrintHead} from "../../types/PrintHead";
import {PrintHeadBehavior, availablePrintHeads} from "../../types/PrintHeadBehavior";
import {INACTIVE_COLOR} from "../_services/style.service";

@Component({
  selector: 'app-printhead-type-select',
  templateUrl: './printhead-type-select.component.html',
  styleUrls: ['./printhead-type-select.component.css']
})
export class PrintheadTypeSelectComponent implements OnInit {
  @Input() printhead!: PrintHead;
  @Input() printheadIndex!: number;
  @Output() temperatureChanged: EventEmitter<any> = new EventEmitter<any>()

  selectedPrintHeadType!: PrintHeadBehavior;
  selectedTemperature!: any;

  public availablePrintHeads: PrintHeadBehavior[] = [];
  temperatureEnabled = false;

  inactiveColor: string = INACTIVE_COLOR;
  constructor() {
    this.selectedPrintHeadType = this.availablePrintHeads[0];
    this.temperatureChanged.emit(this.selectedTemperature);
  }

  ngOnInit() {
    this.availablePrintHeads = availablePrintHeads;
  }

  onPrintheadTypeChanged(event: any) {

  }
}
