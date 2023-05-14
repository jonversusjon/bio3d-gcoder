import { Injectable } from '@angular/core';
import {Well} from "../../types/Well";
import {Printhead} from "../../types/Printhead";
import {PlateFormat} from "../../types/PlateFormat";
import { PrintPosition } from "../../types/PrintPosition";
import { DataAggregatorService } from "./data-aggregator.service";
import { PrintHeadStateService } from "./print-head-state.service";
import {Subscription} from "rxjs";
import {PlateFormatService} from "./plate-format.service";
import {Coordinates} from "../../types/Coordinates";
import {WellsStateService} from "./wells-state.service";
import {PrintPositionService} from "./print-position.service";

@Injectable({
  providedIn: 'root'
})
export class GcodeService {

  constructor(private dataService: DataAggregatorService) {
    // this.printHeadStateSubscription = this.printHeadStateService.printHeads$.subscribe(printHeads => {
    //   this.printHeads = printHeads;
    // });
    //
    // this.plateFormatSubscription = this.plateFormatService.selectedPlate$.subscribe((plate) => {
    //   this.selectedPlate = plate;
    // });
    //
    // this.wellsStateSubscription = this.wellsStateService.wells$.subscribe((wells: Well[][]) => {
    //   this.wells = wells;
    // });

  }

  generateGcode() {
    interface PrintHeadTask {
      description: string;

    }
    const data = this.dataService.getAggregatedData();
    const wells: Well[] = data["well-snapshot"];
    const printHeads: Printhead[] = data["printhead-snapshot"];

    const activePrintHeads = printHeads.filter(
      (printHead: Printhead) => printHead.active);

    for(const printHead of printHeads) {

    }
  }


}
