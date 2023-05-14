import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { PlateFormat } from "../../types/PlateFormat";
import { PrintHeadStateService } from "../_services/print-head-state.service";
import {CalibrationService} from "../_services/calibration.service";
import { WellsStateService } from "../_services/wells-state.service";
import {PrintPositionService} from "../_services/print-position.service";
import {StyleService} from "../_services/style.service";
import {ScreenUtils} from "../_services/screen-utils";
import {PlateFormatService} from "../_services/plate-format.service";
import {MatSelectChange} from "@angular/material/select";
import {Coordinates} from "../../types/Coordinates";
import {Subject} from "rxjs";
import {Printhead} from "../../types/Printhead";


@Component({
  selector: 'app-experiment-setup',
  templateUrl: './experiment-setup.component.html',
  styleUrls: ['./experiment-setup.component.css']
})
export class ExperimentSetupComponent implements OnInit {
  plateChanged$ = new Subject<PlateFormat>();

  public selectedPlate!: PlateFormat;
  public experimentSetupHeaderStyle!: any;
  plateFormats: PlateFormat[] = [];
  prevSelectedPlate!: PlateFormat;
  selectedPlateOrigin!: string;

  public plateHeightPX!: number;
  public plateWidthPX!: number;
  printPositionOriginsMM: Coordinates[][] = [];

  constructor(private styleService: StyleService,
              private screenUtils: ScreenUtils,
              public plateFormatService: PlateFormatService,) {
    this.experimentSetupHeaderStyle = this.styleService.getBaseStyle('experiment-setup-header');
    this.initializePlateFormats();
  }

  ngOnInit() {
    this.selectedPlateOrigin = this.plateFormatService.plateOrigins[2].value;
    this.plateHeightPX = this.screenUtils.convertMMToPX(this.plateFormatService.plateHeight);
    this.plateWidthPX = this.screenUtils.convertMMToPX(this.plateFormatService.plateWidth);
  }
  onSelectedPlateChanged(event: any): void {
    const newSelectedPlate = event.value;
    if (newSelectedPlate !== this.prevSelectedPlate) {
      this.prevSelectedPlate = newSelectedPlate;
      this.selectedPlate = newSelectedPlate;
      this.plateFormatService.setSelectedPlate(newSelectedPlate);
      this.printPositionOriginsMM = [];
      // for (let printHead of this.printHeads) {
      //   this.printPositionOriginsMM.push(
      //     // this.printPositionService.getPrintPositionOriginsMM('plate-map', 'parent-element', this.selectedPlate.well_sizeMM)
      //   );
      // }
      this.plateChanged$.next(this.selectedPlate);


      // console.log('printPositionOriginsMM after: ', this.printPositionOriginsMM);
    }
    // this.widthMajorTicks = this.createTickPositions(this.selectedPlate.widthMM, this.selectedPlate.lengthMM, 10, 5);
    // this.widthMinorTicks = this.createTickPositions(this.selectedPlate.widthMM, this.selectedPlate.lengthMM, 10, 1);
    // this.lengthMajorTicks = this.createTickPositions(this.selectedPlate.lengthMM, this.selectedPlate.widthMM, 10, 5);
    // this.lengthMinorTicks = this.createTickPositions(this.selectedPlate.lengthMM, this.selectedPlate.widthMM, 10, 1);
  }
  initializePlateFormats() {
    this.plateFormats = this.plateFormatService.getPlateFormats()
    this.selectedPlate = this.plateFormats[0];
    this.prevSelectedPlate = this.selectedPlate;
    this.plateFormatService.setSelectedPlate(this.selectedPlate);
    // this.printPositionOriginsMM[0] = this.printPositionService.getPrintPositionOriginsMM('plate-map', 'parent-element', this.selectedPlate.well_sizeMM);
  }
  onSelectedPlateOriginChanged(event: MatSelectChange): void {
    this.selectedPlateOrigin = event.value;
  }
}

