// TODO: need a way to code for the coordinates of the plate map
// TOFO: need a way to code for calibrations - well_well_x, well_well_y, a1_center_left_edge, a1_center_top_edge, plate_height, well_depth
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PlateFormatService {
  private selectedPlateSource = new BehaviorSubject<any>(null);
  selectedPlate$ = this.selectedPlateSource.asObservable();

  private plateFormats: any[] = [];


  constructor(private localStorageService: LocalStorageService) {
    this.loadPlateFormats();
  }

  getPlateFormats() {
    return this.plateFormats;
  }

  getDefaultPlateFormat() {
    return this.plateFormats[0];
  }
  setSelectedPlate(plate: any) {
    this.selectedPlateSource.next(plate);
  }

  savePlateFormats() {
    this.localStorageService.setItem('plateFormats', this.plateFormats);
  }

  loadPlateFormats() {
    const storedPlateFormats = this.localStorageService.getItem<any[]>('plateFormats');
    if (storedPlateFormats) {
      this.plateFormats = storedPlateFormats;
    } else {
      this.plateFormats = [
        // Default plate formats data
      ];
      this.savePlateFormats(); // Save the default data to LocalStorage
    }
  }
}

