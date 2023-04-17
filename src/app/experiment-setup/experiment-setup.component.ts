import {Component, EventEmitter, Output} from '@angular/core';
import { PlateFormat } from "../../types/PlateFormat";

@Component({
  selector: 'app-experiment-setup',
  templateUrl: './experiment-setup.component.html',
  styleUrls: ['./experiment-setup.component.css']
})
export class ExperimentSetupComponent {
  @Output() printHeadChanged = new EventEmitter<number>();
  @Output() plateFormatChanged = new EventEmitter<PlateFormat>();

// Handle the change in the number of print heads and emit an event
  onPrintHeadChange(newNumberOfPrintHeads: number) {
    this.printHeadChanged.emit(newNumberOfPrintHeads);
  }

// Handle the change in the selected plate format and emit an event
  onPlateFormatChange(newPlateFormat: PlateFormat) {
    this.plateFormatChanged.emit(newPlateFormat);
  }

}

