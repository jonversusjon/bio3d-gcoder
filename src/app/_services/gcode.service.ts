import { Injectable } from '@angular/core';
import {Well} from "../../types/Well";
import {PrintHead} from "../../types/PrintHead";
import {PlateFormat} from "../../types/PlateFormat";
import { PrintHeadButton } from "../../types/PrintHeadButton";
import { DataAggregatorService } from "./data-aggregator.service";
import { PrintHeadStateService } from "./print-head-state.service";
import {Subscription} from "rxjs";
import {PlateFormatService} from "./plate-format.service";

@Injectable({
  providedIn: 'root'
})
export class GcodeService {

  private selectedPlate: PlateFormat | null = null;
  private wells: Well[][] | null = null;
  private printHeads: PrintHead[] | null = null;
  private printPositions: PrintHeadButton[] | null = null;

  private printHeadStateSubscription!: Subscription;
  constructor(private dataService: DataAggregatorService,
              private printHeadStateService: PrintHeadStateService,
              private plateFormatService: PlateFormatService) {
    // this.printHeadStateSubscription = this.printHeadStateService.printHeads$.subscribe(printHeads => {
    //   this.printHeads = printHeads;
    // });
    //
    // this.plateFormatService.selectedPlate$.subscribe((plate) => {
    //   this.selectedPlate = plate
    // });
  }

  formatExperimentDetails() {
    const data = this.dataService.getAggregatedData();
    this.wells = data["well-snapshot"];
    this.printHeads = data["printhead-snapshot"];

    const selectedPrintPositions = [];
    //cycle through printheads
    for(let printHead of this.printHeads) {
      if( printHead.active ) {
        // extract selected buttons
        const selectedButtons = printHead.printPositionButtons.filter(
          button => button.selected
        );
        selectedPrintPositions.push(selectedButtons);
      }
    }
    console.log('gcode selectedButtons: ', selectedPrintPositions);

  }

}
