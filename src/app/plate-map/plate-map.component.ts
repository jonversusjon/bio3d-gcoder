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
  plateFormats: PlateFormat[] = [];
  selectedPlate!: PlateFormat;
  prevSelectedPlate!: PlateFormat;

  plateHeight = 85.4;
  plateWidth = 127.6;
  plateHeightPX = this.toPX(this.plateHeight);
  plateWidthPX = this.toPX(this.plateWidth);

  private customButtonToggleStyle: any;
  private printHeadStateSubscription!: Subscription;

  printPositionOriginsMM: Coordinates[][] = [];

  magnifierSize = 135;
  magnificationFactor = 2;
  magnifierStyle: {
    display: string;
    left: string;
    top: string;
    visibility: string;
    width: number;
    height: number;
  } = {
    display: 'none',
    left: '0px',
    top: '0px',
    visibility: 'hidden',
    width: this.magnifierSize,
    height: this.magnifierSize
  };

  magnifiedContentStyle: {
    transform: string;
    left: string;
    top: string;
    backgroundPosition: string;
  } = {
    transform: `scale(${this.magnificationFactor})`,
    left: '0px',
    top: '0px',
    backgroundPosition: '0px 0px',
  };

  constructor(
    private gcodeService: GcodeService,
    private screenUtils: ScreenUtils,
    private plateFormatService: PlateFormatService,
    private printHeadStateService: PrintHeadStateService,
    private rendererFactory: RendererFactory2,
    private styleService: StyleService,
    private calibrationService: CalibrationService,
    private wellsStateService: WellsStateService,
    public printPositionService: PrintPositionService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializePlateFormats();
    this.initializePrintHeadStateSubscription();
    this.updatePlateMap(this.selectedPlate, this.plateMap);
    this.subscribeToCalibrationUpdates();
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

  initializePlateFormats() {
    this.plateFormats = this.plateFormatService.getPlateFormats()
    this.selectedPlate = this.plateFormats[0];
    this.prevSelectedPlate = this.selectedPlate;
    this.plateFormatService.setSelectedPlate(this.selectedPlate);
    this.printPositionOriginsMM[0] = this.printPositionService.getPrintPositionOriginsMM('plate-map', this.selectedPlate.well_sizeMM);
  }

  initializePrintHeadStateSubscription() {
    this.printHeadStateSubscription = this.printHeadStateService.printHeads$.subscribe(printHeads => {
      this.printHeads = printHeads;
      this.onGetPrintHeadChanges(printHeads);
    });
  }

  subscribeToCalibrationUpdates() {
    this.calibrationService.xCalibration$.subscribe(value => this.xCalibration = value);
    this.calibrationService.yCalibration$.subscribe(value => this.yCalibration = value);
    this.calibrationService.zCalibration$.subscribe(value => this.zCalibration = value);
  }

  onGetPrintHeadChanges(printHeads: PrintHead[]) {
    if(printHeads.length > 0) {
      this.printPositionOriginsMM = printHeads.map(() => this.printPositionService.getPrintPositionOriginsMM('plate-map', this.selectedPlate.well_sizeMM));
    }
  }

  initializeSelectedPlate(plateMap: PlateMap) {
    this.updatePlateMap(this.selectedPlate, plateMap);
    this.plateFormatService.setSelectedPlate(this.selectedPlate);

  }

  onSelectedPlateChanged(event: MatSelectChange): void {
    const newSelectedPlate = event.value;
    if (newSelectedPlate !== this.prevSelectedPlate) {
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

  onMouseMove(event: MouseEvent) {

    const scaleFactor = 1.5;

    this.magnifierStyle.display = 'block';
    this.magnifierStyle.left = event.clientX - this.magnifierSize / 2 + 'px';
    this.magnifierStyle.top = event.clientY - this.magnifierSize / 2 + 'px';

    this.magnifiedContentStyle.left = -event.clientX * (scaleFactor - 1) + this.magnifierSize / 2 + 'px';
    this.magnifiedContentStyle.top = -event.clientY * (scaleFactor - 1) + this.magnifierSize / 2 + 'px';
  }

  onMouseLeave() {
    this.magnifierStyle.display = 'none';
  }

  getMagnifierStyle() {
    return {
      ...this.magnifierStyle,
      height: this.magnifierSize + 'px',
      width: this.magnifierSize + 'px'
    }
  }
  toggleMagnifier(visible: boolean, event?: MouseEvent, wellElement?: HTMLElement): void {
    if (visible && event && wellElement) {
      const magnifierSize = this.magnifierSize; // Change this value to match the size of your magnifier element
      const halfMagnifierSize = magnifierSize / 2;

      // Set magnifierStyle's 'top' and 'left' properties to center the magnifier under the cursor
      this.magnifierStyle = {
        ...this.magnifierStyle,
        display: 'block',
        top: event.clientY - halfMagnifierSize + 'px',
        left: event.clientX - halfMagnifierSize + 'px',
        visibility: 'visible'
      };

      // Update magnifiedContentStyle to show the correct content
      const wellRect = wellElement.getBoundingClientRect();
      const scaleX = (wellRect.width / this.toPX(this.selectedPlate.well_sizeMM))*this.magnificationFactor;
      const scaleY = (wellRect.height / this.toPX(this.selectedPlate.well_sizeMM))*this.magnificationFactor;
      this.magnifiedContentStyle = {
        transform: `scale(${scaleX}, ${scaleY})`,
        top: -wellRect.top * scaleY + 'px',
        left: -wellRect.left * scaleX + 'px',
        backgroundPosition: '0px 0px'
      };
    } else {
      // Hide the magnifier
      this.magnifierStyle = {
        ...this.magnifierStyle,
        display: 'none' };
    }
  }

}
