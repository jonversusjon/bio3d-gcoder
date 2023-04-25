// TODO: this only receives well data from the plate map when wells are selected/deselected or plate is changed
// TODO: it does not get updated printPosition.selected info for the well well printpositions are toggled

import { Injectable } from '@angular/core';
import { PrintHeadStateService } from "./print-head-state.service";
import { WellsStateService } from "./wells-state.service";
import { Well } from "../../types/Well";
import { PrintHead } from "../../types/PrintHead";

@Injectable({
  providedIn: 'root',
})
export class DataAggregatorService {
  private dataServiceWellsSnapshot: Well[][] = [];
  private dataServicePrintHeadsSnapshot: PrintHead[] = [];
  constructor(
    private printPositionService: PrintHeadStateService,
    private wellStateService: WellsStateService)
  {
    this.printPositionService.printHeads$.subscribe((printheads: PrintHead[]) => {
      this.dataServicePrintHeadsSnapshot = printheads;

      console.log('data-aggregator received printheads: ', printheads);
    });
    this.wellStateService.wells$.subscribe((wells: Well[][]) => {
      this.dataServiceWellsSnapshot = wells;
      console.log('data-aggregator received wells: ', wells);
    });
  }

  getAggregatedData() {
    return  {
      'well-snapshot': this.dataServiceWellsSnapshot,
      'printhead-snapshot': this.dataServicePrintHeadsSnapshot
    }
  }
  aggregateData() {
    console.log('dataServicePrintHeadsSnapshot: ', this.dataServicePrintHeadsSnapshot);
    console.log('dataServiceWellsSnapshot: ', this.dataServiceWellsSnapshot);
    /*
    This function needs to create a JSON with
      Plate Information:
        - plateType (including all the plateType Data)
        - selected wells (an array taken from wells[][])
        - any user overrides to plate dimension
      PrintHead Information:
        - active state
        - description
        - color
        - needle (including all the needle info)
        - any user overrides to printhead information
        - array of which printPositions are selected

     */
  }
}
