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

  selectedPlate!: PlateFormat;

  plateFormat: PlateFormat = {
    name: '',
    plateId: 0,
    rows: 0,
    cols: 0,
    well_sizeMM: 0,
    well_spacing_x_MM: 0,
    well_spacing_y_MM: 0,
    a1_centerMM: { x: 0, y: 0 },
    elementType: 'PlateFormat',
    printPositionSizeMM: 0
  };

// Handle the change in the number of print heads and emit an event
  onPrintHeadChange(newNumberOfPrintHeads: number) {
    console.log('emit printHeadChange event');
    this.printHeadChanged.emit(newNumberOfPrintHeads);
  }

  onPlateFormatChanged(newPlateFormat: PlateFormat) {
    this.plateFormat = newPlateFormat;
  }

  onSelectedPlateChanged(selectedPlate: any) {
    this.selectedPlate = selectedPlate;
    // Pass the selectedPlate to other child components here
  }
}

