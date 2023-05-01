import { Injectable } from '@angular/core';
import {Well} from "../../types/Well";
import {PrintHead} from "../../types/PrintHead";
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

  private selectedPlate!: PlateFormat
  private wells!: Well[][];
  private printHeads!: PrintHead[];
  private printPositions!: PrintPosition[];

  private printHeadStateSubscription!: Subscription;
  private plateFormatSubscription!: Subscription;
  private wellsStateSubscription!: Subscription;

  constructor(private dataService: DataAggregatorService,
              private printHeadStateService: PrintHeadStateService,
              private plateFormatService: PlateFormatService,
              private wellsStateService: WellsStateService,
              private printPositionService: PrintPositionService) {
    this.printHeadStateSubscription = this.printHeadStateService.printHeads$.subscribe(printHeads => {
      this.printHeads = printHeads;
    });

    this.plateFormatSubscription = this.plateFormatService.selectedPlate$.subscribe((plate) => {
      this.selectedPlate = plate;
    });

    this.wellsStateSubscription = this.wellsStateService.wells$.subscribe((wells: Well[][]) => {
      this.wells = wells;
    });

  }
  calculatePrintPositionCoordinates() {
    const plate = this.selectedPlate;
    const printPositions:Coordinates[][] = [];

    this.printHeads.forEach(printHead => {
      if (printHead.active) {
        const selectedPositions: Coordinates[] = [];
        printHead.printPositions.forEach(printPosition => {
          if (printPosition.selected) {
            selectedPositions.push({
              x: printPosition.originMM_absolute.x,
              y: printPosition.originMM_absolute.y,
            });
          }
        });
        if (selectedPositions.length > 0) {
          printPositions.push(selectedPositions);
        }
      }
    });
    console.log(printPositions);

    // const flattenedWellOrigins: Coordinates[] = wellOrigins.flat();
    // const wells = this.dataService.getAggregatedData('well-snapshot');
    // console.log('wells: ', wells);
    //
    // const wellsWithPrintPositions: Coordinates[][] = flattenedWellOrigins.map(wellOrigin => {
    //   return this.currentPrintHeads.map(printHead => {
    //     return printHead.printPositionButtons.map(printPosition => {
    //       return {
    //         x: wellOrigin.x + printPosition.originMM.x,
    //         y: wellOrigin.y + printPosition.originMM.y,
    //       };
    //     });
    //   }).flat();
    // });
    //
    // console.log('wellOrigins: ', wellOrigins);

    return
  }
  // formatExperimentDetails() {
    // const data = this.dataService.getAggregatedData();
    // this.wells = data["well-snapshot"];
    // this.printHeads = data["printhead-snapshot"];
    //
    // const selectedPrintPositions = [];
    // //cycle through printheads
    // for(let printHead of this.printHeads) {
    //   if( printHead.active ) {
    //     // extract selected buttons
    //     const selectedButtons = printHead.printPositionButtons.filter(
    //       button => button.selected
    //     );
    //     selectedPrintPositions.push(selectedButtons);
    //   }
    // }
    // console.log('gcode selectedButtons: ', selectedPrintPositions);

  // }

}
