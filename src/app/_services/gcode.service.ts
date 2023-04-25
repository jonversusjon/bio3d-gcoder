import { Injectable } from '@angular/core';
import {Well} from "../../types/Well";
import {PrintHead} from "../../types/PrintHead";
import {PlateFormat} from "../../types/PlateFormat";
import { PrintHeadButton } from "../../types/PrintHeadButton";
import { DataAggregatorService } from "./data-aggregator.service";

@Injectable({
  providedIn: 'root'
})
export class GcodeService {

  private selectedPlate: PlateFormat | null = null;
  private wells: Well[][] | null = null;
  private printHeads: PrintHead[] | null = null;
  private printPositions: PrintHeadButton[] | null = null;

  constructor(private dataService: DataAggregatorService) {
  }

  formatExperimentDetails() {
    const data = this.dataService.getAggregatedData();
    this.wells = data["well-snapshot"];
    this.printHeads = data["printhead-snapshot"];

    //cycle through printheads
    for(let printHead of this.printHeads) {
      if( printHead.active ) {
        // extract selected buttons
        const selectedButtons = printHead.printPositionButtons.filter(
          button => button.selected
        );
        console.log('gcode selectedButtons: ', selectedButtons);
      }
    }

    console.log('gcode this.printHeads: ', this.printHeads);
  }

}
