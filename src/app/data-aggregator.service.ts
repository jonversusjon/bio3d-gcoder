import { Injectable } from '@angular/core';
import {PlateFormat} from "../types/PlateFormat";
import {Well} from "../types/Well";


@Injectable({
  providedIn: 'root',
})
export class DataAggregatorService {
  private selectedPlate: PlateFormat | null = null;
  private wellStates: Well[][] = [];

  constructor() {}

  logData(): void {
    console.log('Selected Plate:', this.getSelectedPlate());
    console.log('Well States:', this.getWellStates());
    console.log('------------------------ end logging -----------------------');
  }

  setSelectedPlate(plate: PlateFormat): void {
    this.selectedPlate = plate;
  }

  getSelectedPlate(): PlateFormat | null {
    return this.selectedPlate;
  }

  setWellStates(wells: Well[][]): void {
    this.wellStates = wells;
  }

  getWellStates(): Well[][] {
    return this.wellStates;
  }
}
