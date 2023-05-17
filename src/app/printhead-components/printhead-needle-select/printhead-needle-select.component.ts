import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Needle, needles} from "../../../types/Needle";
import {PrintHeadStateService} from "../../_services/print-head-state.service";
import {Printhead} from "../../../types/Printhead";
// TODO: update needle select with mat tooltip giving info about the selected needle (odMM, color, etc.)
@Component({
  selector: 'app-printhead-needle-select',
  templateUrl: './printhead-needle-select.component.html',
  styleUrls: ['./printhead-needle-select.component.css']
})
export class PrintheadNeedleSelectComponent {
  @Input() printhead!: Printhead;
  @Output() needleChanged: EventEmitter<Needle> = new EventEmitter<Needle>();
  availableNeedles:Needle[] = [];

  selectedNeedle!: Needle;
  constructor(private printHeadStateService: PrintHeadStateService) {
    this.availableNeedles = needles;
  }

  onNeedleChange(event: any) {
    this.selectedNeedle = event.value;
    this.needleChanged.emit(event.value);
  }

}


