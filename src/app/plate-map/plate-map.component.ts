// TODO: make a legend showing color, order and description of print steps
// TODO: some kind of calibration input
// TODO: calculate print moves
// TODO: this component should feed selectedPlate to the data aggregator, all of the well selected info
//       now goes in the well-state service
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  RendererFactory2
} from '@angular/core';
import { Subscription } from "rxjs";
import {ScreenUtils} from "../_services/screen-utils";
import {PlateFormatService} from '../_services/plate-format.service';
import { PlateFormat } from "../../types/PlateFormat";
import { PrintHeadStateService } from "../_services/print-head-state.service";
import { PrintHead } from "../../types/PrintHead";
import { PrintHeadButton } from "../../types/PrintHeadButton";
import {MatSelectChange} from "@angular/material/select";
import {StyleService} from "../_services/style.service";
import {CalibrationService} from "../_services/calibration.service";
import { WellsStateService } from "../_services/wells-state.service";
import {PlateMap} from "../../types/PlateMap";
import { GcodeService } from "../_services/gcode.service";
import {PrintPositionService} from "../_services/print-position.service";
import {Coordinates} from "../../types/Coordinates";

@Component({
  selector: 'app-plate-map',
  templateUrl: './plate-map.component.html',
  styleUrls: ['./plate-map.component.css'],
  providers: [ScreenUtils],

})
export class PlateMapComponent implements OnInit, AfterViewInit, OnDestroy {
  private renderer: Renderer2;
  printHeads!: PrintHead[];

  xCalibration = 1;
  yCalibration = 1;
  zCalibration = 1;

  plateMap: PlateMap = { wells: [], columnHeaders: [], rowHeaders: [] };

  plateFormats: any[] = [];
  selectedPlate!: PlateFormat;
  prevSelectedPlate!: PlateFormat;

  plateHeight = 85.4; // mm = 323px;
  plateWidth = 127.6; //mm = 482px => 3.777px/mm
  plateHeightPX = this.toPX(this.plateHeight);
  plateWidthPX = this.toPX(this.plateWidth);

  private customButtonToggleStyle: any;
  private printHeadStateSubscription!: Subscription;

  printPositionOriginsMM: Coordinates[][] = [];

  constructor(
    private gcodeService: GcodeService,
    private screenUtils: ScreenUtils,
    private plateFormatService: PlateFormatService,
    private printHeadStateService: PrintHeadStateService,
    private rendererFactory: RendererFactory2,
    private styleService: StyleService,
    private calibrationService: CalibrationService,
    private wellsStateService: WellsStateService,
    private printPositionService: PrintPositionService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.plateFormats = plateFormatService.getPlateFormats()
    this.selectedPlate = this.plateFormats[0];
    this.plateFormatService.setSelectedPlate(this.selectedPlate);
    this.prevSelectedPlate = this.selectedPlate;
    this.printPositionOriginsMM[0] = this.printPositionService.getPrintPositionOriginsMM('plate-map', this.selectedPlate.well_sizeMM);
    console.log('plate-map initialized with print position origins ', this.printPositionOriginsMM);
    this.printHeadStateSubscription = this.printHeadStateService.printHeads$.subscribe(printHeads => {
      console.log('plate map component notified of printhead changes');
      // this.printHeads = printHeads;
      this.onGetPrintHeadChanges(printHeads);
    });

    this.updatePlateMap(this.selectedPlate, this.plateMap);

    this.calibrationService.xCalibration$.subscribe(value => {
      this.xCalibration = value;
    });
    this.calibrationService.yCalibration$.subscribe(value => {
      this.yCalibration = value;
    });
    this.calibrationService.zCalibration$.subscribe(value => {
      this.zCalibration = value;
    });
  }

  ngOnInit(): void {
    this.customButtonToggleStyle = this.styleService.getBaseStyle('custom-button-toggle');
  }

  ngAfterViewInit() {
    this.initializeSelectedPlate(this.plateMap);
  }

  ngOnDestroy(): void {
    if (this.printHeadStateSubscription) {
      this.printHeadStateSubscription.unsubscribe();
    }
  }

  onGetPrintHeadChanges(printHeads: PrintHead[]) {
    if(printHeads.length > 0) {
      this.printPositionOriginsMM = [];
      for (let printHead of printHeads) {
        this.printPositionOriginsMM.push(this.printPositionService.getPrintPositionOriginsMM('plate-map', this.selectedPlate.well_sizeMM));
      }
    }
  }

  initializeSelectedPlate(plateMap: PlateMap) {
    this.updatePlateMap(this.selectedPlate, plateMap);
    this.plateFormatService.setSelectedPlate(this.selectedPlate);

  }

  onSelectedPlateChanged(event: MatSelectChange): void {
    const newSelectedPlate = event.value;
    if (newSelectedPlate !== this.prevSelectedPlate) {
      console.log('printPositionOriginsMM before: ', this.printPositionOriginsMM);
      this.prevSelectedPlate = newSelectedPlate;
      this.selectedPlate = newSelectedPlate;
      this.plateFormatService.setSelectedPlate(newSelectedPlate);
      this.printPositionOriginsMM = [];
      for(let printHead of this.printHeads) {
        this.printPositionOriginsMM.push(
          this.printPositionService.getPrintPositionOriginsMM('plate-map', this.selectedPlate.well_sizeMM)
        );
      }

      this.updatePlateMap(newSelectedPlate, this.plateMap);


      console.log('printPositionOriginsMM after: ', this.printPositionOriginsMM);
    }
  }

  updatePlateMap(selectedPlate: PlateFormat, plateMap: PlateMap, event?: MouseEvent) {
    if (this.selectedPlate) {
      this.wellsStateService.updatePlateMap(selectedPlate, plateMap, event);
    }
  }

  get plateStyle() {
    return {
      position: 'relative',
      border: '1px solid #000',
      height: `${this.plateHeightPX}px`,
      width: `${this.plateWidthPX}px`,
      marginTop: '1em',
      backgroundColor: '#efefef',
      borderRadius: '12px'
    };
  }

  toggleWellSelection(plateMap: PlateMap, wellIndex: number, row: number) {
    this.wellsStateService.toggleWellSelection(plateMap, wellIndex, row);
  }
  toggleRowSelection(selectedPlate: PlateFormat, plateMap: PlateMap,rowIndex: number, event?: MouseEvent) {
    this.wellsStateService.toggleRowSelection(selectedPlate, plateMap, rowIndex, event);
  }
  toggleColumnSelection(selectedPlate: PlateFormat, plateMap: PlateMap, colIndex: number, event?: MouseEvent) {
    this.wellsStateService.toggleColumnSelection(selectedPlate, plateMap, colIndex, event);
  }
  updateCalibrationValues() {
    this.calibrationService.setXCalibration(this.xCalibration);
    this.calibrationService.setYCalibration(this.yCalibration);
    this.calibrationService.setZCalibration(this.zCalibration);
  }
  toPX(size_in_mm: number) {
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  getButtonWidthPX(printHead: PrintHead) {
    const buttonWidthMM = printHead.buttonWidthPX;
    return this.toPX(buttonWidthMM);
  }

  getPrintPositionOriginsMM() {
    return this.printPositionService.getPrintPositionOriginsMM("plate-map", this.selectedPlate.well_sizeMM);
  }


  getStylePrintPositionButton(printHead: PrintHead, printHeadButton: PrintHeadButton) {
    const buttonOrigins = this.printPositionOriginsMM[printHead.printHeadIndex];
    const buttonSizePX = this.getPrintPositionButtonWidthPX(printHead.needle.odMM);
    let topPX = this.getButtonTopPX(buttonOrigins, printHeadButton.position) - (buttonSizePX/2);
    let lfPX = this.getButtonLeftPX(buttonOrigins, printHeadButton.position) - (buttonSizePX/2);
    const buttonColor = printHead.active? (printHeadButton.selected ? printHead.color : 'white') : '#f1f1f1';

    return {
      ...this.customButtonToggleStyle,
      'width': buttonSizePX + 'px',
      'top': topPX + 'px',
      'left': lfPX + 'px',
      'background-color': buttonColor,
      border:'none',
    };
  }

  getPrintPositionButtonWidthPX(needleOdMM: number) {
    const plateMapWellDiamMM = this.selectedPlate.well_sizeMM;
    console.log('plate-map-component plateMapWellDiamMM: ', plateMapWellDiamMM);
    return this.toPX(this.printPositionService.getButtonWidthMM('plate-map', plateMapWellDiamMM, needleOdMM));
  }
  getButtonLeftPX(buttonOrigins: Coordinates[], printHeadButtonPosition: number) {
    const buttonLeftMM = this.printPositionService.getButtonLeftMM(buttonOrigins, printHeadButtonPosition);
    return this.toPX(buttonLeftMM);
  }

  getButtonTopPX(buttonOrigins: Coordinates[], printHeadButtonPosition: number) {
    const buttonTopMM = this.printPositionService.getButtonTopMM(
      buttonOrigins, printHeadButtonPosition);
    return this.toPX(buttonTopMM);
  }
  logState() {
    this.gcodeService.formatExperimentDetails();
  }
}
