import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Needle} from "../../types/Needle";
import {PrintHeadStateService} from "../_services/print-head-state.service";
import {PrintHead} from "../../types/PrintHead";

@Component({
  selector: 'app-printhead-needle-select',
  templateUrl: './printhead-needle-select.component.html',
  styleUrls: ['./printhead-needle-select.component.css']
})
export class PrintheadNeedleSelectComponent {
  @Input() printhead!: PrintHead;
  availableNeedles:Needle[] = [];

  selectedNeedle!: Needle;
  constructor(private printHeadStateService: PrintHeadStateService) {
    this.availableNeedles = this.printHeadStateService.needles;
  }

  onNeedleChange(event: any) {
    this.selectedNeedle = event.value;
    this.printHeadStateService.updatePrintHeadProperty(this.printhead.index, "needle", event.value);
  }

  protected readonly print = print;
}


