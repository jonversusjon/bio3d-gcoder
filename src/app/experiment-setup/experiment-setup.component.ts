import {Component, EventEmitter, Output} from '@angular/core';
import { PlateFormat } from "../../types/PlateFormat";

@Component({
  selector: 'app-experiment-setup',
  templateUrl: './experiment-setup.component.html',
  styleUrls: ['./experiment-setup.component.css']
})
export class ExperimentSetupComponent {

  // plateFormat: PlateFormat = {
  //   name: '',
  //   plateId: 0,
  //   rows: 0,
  //   cols: 0,
  //   well_sizeMM: 0,
  //   well_spacing_x_MM: 0,
  //   well_spacing_y_MM: 0,
  //   a1_centerMM: { x: 0, y: 0 },
  //   elementType: 'PlateFormat',
  //   printPositionSizeMM: 0,
  //   well_bottom_thicknessMM: 0,
  //   well_depth_MM: 0,
  // };

// Handle the change in the number of print heads and emit an event

}

