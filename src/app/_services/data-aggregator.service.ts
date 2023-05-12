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
    private printHeadStateService: PrintHeadStateService,
    private wellStateService: WellsStateService)
  {
    this.printHeadStateService.printHeads$.subscribe((printheads: PrintHead[]) => {
      this.dataServicePrintHeadsSnapshot = printheads;
      console.log('data-aggregator received printheads: ', printheads);
    });
    this.wellStateService.wells$.subscribe((wells: Well[][]) => {
      this.dataServiceWellsSnapshot = wells;
      console.log('data-aggregator received wells: ', wells);
    });
  }

  getAggregatedData(key?: string) {
    const data: { [key: string]: any } = {
        'well-snapshot': this.dataServiceWellsSnapshot,
        'printhead-snapshot': this.dataServicePrintHeadsSnapshot
      }
    return key ? data[key] : data;
  }
  aggregateData() {
    const activePrintHeads = this.dataServicePrintHeadsSnapshot.filter(
      printHead => printHead.active);
    console.log('activePrintHeads: ', activePrintHeads);

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

  receiveData(data: any): void {
    // Handle the received data in the WellsStateService
    // Perform any necessary actions based on the received data
    console.log('Received data in WellsStateService:', data);
    // ...
  }
}
