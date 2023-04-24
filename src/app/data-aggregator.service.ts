// TODO: this only receives well data from the plate map when wells are selected/deselected or plate is changed
// TODO: it does not get updated printPosition.selected info for the well well printpositions are toggled

import { Injectable } from '@angular/core';
import {PlateFormat} from "../types/PlateFormat";
import {Well} from "../types/Well";
import {PrintPositionService} from "./print-position.service";
import {BehaviorSubject, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class DataAggregatorService {
  public plateMapWellsSubject = new BehaviorSubject<Well[][]>([]);
  private plateMapWellsSubscription: Subscription;
  constructor(
    private printPositionService: PrintPositionService,
    ) {
    this.printPositionService.printHeads$.subscribe((printheads) => {
      console.log('data-aggregator received printheads: ', printheads);
    });
    this.plateMapWellsSubscription = this.plateMapWellsSubject.subscribe((wells: Well[][]) => {
      console.log('data-aggregator received wells: ', wells);
    });
  }

  logData(): void {
    // console.log('Selected Plate:', this.getSelectedPlate());
    // console.log('Well States:', this.getWellStates());
    // console.log('------------------------ end logging -----------------------');
  }

}
