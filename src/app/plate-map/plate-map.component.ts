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
import {DataAggregatorService} from "../_services/data-aggregator.service";
import { WellsStateService } from "../_services/wells-state.service";
import {PlateMap} from "../../types/PlateMap";
import { ChangeDetectorRef } from "@angular/core";
import { GcodeService } from "../_services/gcode.service";

@Component({
  selector: 'app-plate-map',
  templateUrl: './plate-map.component.html',
  styleUrls: ['./plate-map.component.css'],
  providers: [ScreenUtils],

})
export class PlateMapComponent implements OnInit, AfterViewInit, OnDestroy {
  private renderer: Renderer2;
  public printHeads!: PrintHead[];

  xCalibration = 1;
  yCalibration = 1;
  zCalibration = 1;

  plateMap: PlateMap = { wells: [], columnHeaders: [], rowHeaders: [] };

  plateFormats: any[] = [];
  selectedPlate!: PlateFormat;
  prevSelectedPlate!: PlateFormat;

  plateHeight = 85.4; // mm
  plateWidth = 127.6; //mm
  plateHeightPX = this.toPX(this.plateHeight);
  plateWidthPX = this.toPX(this.plateWidth);

  private customButtonToggleStyle: any;
  private printHeadStateSubsciption: Subscription;
  constructor(
    private gcodeService: GcodeService,
    private screenUtils: ScreenUtils,
    private plateFormatService: PlateFormatService,
    private printHeadStateService: PrintHeadStateService,
    private rendererFactory: RendererFactory2,
    private styleService: StyleService,
    private calibrationService: CalibrationService,
    private dataService: DataAggregatorService,
    private wellsStateService: WellsStateService,
    private cd: ChangeDetectorRef,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.plateFormats = plateFormatService.getPlateFormats()
    this.selectedPlate = this.plateFormats[0];
    this.plateFormatService.setSelectedPlate(this.selectedPlate);
    this.prevSelectedPlate = this.selectedPlate;

    this.printHeadStateSubsciption = this.printHeadStateService.printHeads$.subscribe(printHeads => {
      this.printHeads = printHeads;
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
    if (this.printHeadStateSubsciption) {
      this.printHeadStateSubsciption.unsubscribe();
    }
  }
  initializeSelectedPlate(plateMap: PlateMap) {
    this.updatePlateMap(this.selectedPlate, plateMap);
    // this.plateFormatChanged.emit(this.selectedPlate);
    // this.printHeadStateService.setSelectedPlate(this.selectedPlate);
    this.plateFormatService.setSelectedPlate(this.selectedPlate);

  }

  onSelectedPlateChanged(event: MatSelectChange): void {
    const newSelectedPlate = event.value;

    if (newSelectedPlate !== this.prevSelectedPlate) {

      this.updatePlateMap(newSelectedPlate, this.plateMap);
      this.prevSelectedPlate = newSelectedPlate;
      this.selectedPlate = newSelectedPlate;
      this.plateFormatService.setSelectedPlate(newSelectedPlate);
    }
  }

  updatePlateMap(selectedPlate: PlateFormat, plateMap: PlateMap, event?: MouseEvent) {
    if (this.selectedPlate) {
      this.wellsStateService.updatePlateMap(selectedPlate, plateMap, event);
      this.plateFormatService.setSelectedPlate(this.selectedPlate);
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

  scale(valueToScale: number) {
    const printPickerSizeMM = this.printHeads[0].pickerWell.sizeMM;
    const wellSizeMM = this.selectedPlate.well_sizeMM;
    const ratio = wellSizeMM / printPickerSizeMM;

    return valueToScale * ratio;
  }
  getButtonWidthPX(printHead: PrintHead) {
    const buttonWidthMM = printHead.buttonWidthMM;
    const plateMapButtonSizeMM = this.scale(buttonWidthMM);

    return this.toPX(plateMapButtonSizeMM);
  }

  getButtonTopPX(printHead: PrintHead, buttonIndex: number) {
    const buttonTopMM = this.printHeadStateService.getButtonTopMM(printHead, buttonIndex);
    const adjustedScaledButtonTopMM = this.scale(buttonTopMM); //- (scaledButtonWidthMM/2);
    return this.toPX(adjustedScaledButtonTopMM);
  }

  getButtonLeftPX(printHead: PrintHead, buttonIndex: number) {
    const buttonLeftMM = this.printHeadStateService.getButtonLeftMM(printHead, buttonIndex);
    const adjustedScaledButtonLeftMMv= this.scale(buttonLeftMM); //- (scaledButtonWidthMM/2);

    return this.toPX(adjustedScaledButtonLeftMMv);
  }

  getMergedStyles(printHead: PrintHead, button: PrintHeadButton) {
    const wdPX = this.toPX(printHead.buttonWidthMM);
    const tpPX = this.getButtonTopPX(printHead, button.position) - (wdPX/2);
    const lfPX = this.getButtonLeftPX(printHead, button.position) - (wdPX/2)
    const mergedStyle =
      {
        ...this.customButtonToggleStyle,
        'width': wdPX + 'px',
        'top': tpPX + 'px',
        'left': lfPX + 'px',
        'background-color': button.selected ? printHead.color : 'white',
        'border': 'none'
      };
    return mergedStyle;

  }
  logState() {
    this.gcodeService.formatExperimentDetails();
  }
}
