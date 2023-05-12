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
  @Output() needleChanged: EventEmitter<any> = new EventEmitter<any>()
  availableNeedles:Needle[] = [];

  selectedNeedle!: Needle;
  constructor(private printHeadStateService: PrintHeadStateService) {
    this.availableNeedles = this.printHeadStateService.needles;
  }

  onNeedleChange(event: any) {
    this.selectedNeedle = event.value;
    this.needleChanged.emit(this.selectedNeedle);
  }

  protected readonly print = print;
}


