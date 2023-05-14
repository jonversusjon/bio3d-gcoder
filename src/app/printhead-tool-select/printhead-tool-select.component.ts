import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Printhead} from "../../types/Printhead";
import {PrintheadToolBehavior} from "../../types/PrintheadToolBehavior";
import {INACTIVE_COLOR} from "../_services/style.service";
import {PrintHeadStateService} from "../_services/print-head-state.service";
import {availablePrintheadTools, PrintheadTool} from "../../types/PrintheadTool";

@Component({
  selector: 'app-printhead-tool-select',
  templateUrl: './printhead-tool-select.component.html',
  styleUrls: ['./printhead-tool-select.component.css']
})
export class PrintheadToolSelectComponent {
  @Input() printhead!: Printhead;
  @Input() selectedPrintheadTool!: PrintheadTool;
  @Output() printheadToolChanged = new EventEmitter<PrintheadTool>();
  @Output() temperatureChanged: EventEmitter<any> = new EventEmitter<any>()

  selectedPrintHeadBehavior!: PrintheadToolBehavior;
  selectedTemperature!: any;
  public printheadToolOptions = availablePrintheadTools;

  constructor() {
    this.selectedPrintHeadBehavior = availablePrintheadTools[0].behavior;
    this.temperatureChanged.emit(this.selectedTemperature);
  }

  onPrintheadToolChanged(newPrintheadTool: PrintheadTool) {
    this.selectedPrintheadTool = newPrintheadTool;
    console.log('emitting new printheadtool ', newPrintheadTool);
    this.printheadToolChanged.emit(newPrintheadTool);
  }
}
