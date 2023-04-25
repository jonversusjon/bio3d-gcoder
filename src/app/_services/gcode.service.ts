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
    console.log('gcode this.wells: ', this.wells);
    console.log('gcode this.printHeads: ', this.printHeads);
  }

}
