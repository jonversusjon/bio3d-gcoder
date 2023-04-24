// TODO: make a legend showing color, order and description of print steps
// TODO: some kind of calibration input
// TODO: calculate print moves
// TODO: this component should feed selectedPlate to the data aggregator, all of the well selected info
//       now goes in the well-state service
import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  RendererFactory2
} from '@angular/core';
import {Subscription} from "rxjs";
import {FormsModule} from "@angular/forms";
import {ScreenUtils} from "../_services/screen-utils";
import {PlateFormatService} from '../_services/plate-format.service';
import { PlateFormat } from "../../types/PlateFormat";
import { PrintPositionService } from "../_services/print-position.service";
import { PrintHead } from "../../types/PrintHead";
import { PrintHeadButton } from "../../types/PrintHeadButton";
import {MatSelectChange} from "@angular/material/select";
import {StyleService} from "../_services/style.service";
import {CalibrationService} from "../_services/calibration.service";
import {DataAggregatorService} from "../_services/data-aggregator.service";
import { WellsStateService } from "../_services/wells-state.service";
import { SelectionRectangleComponent } from "../selection-rectangle/selection-rectangle.component";
import {PlateMap} from "../../types/PlateMap";

@Component({
  selector: 'app-plate-map',
  templateUrl: './plate-map.component.html',
  styleUrls: ['./plate-map.component.css'],
  providers: [ScreenUtils],

})
export class PlateMapComponent implements OnInit, OnDestroy {
  private renderer: Renderer2;

  xCalibration = 1;
  yCalibration = 1;
  zCalibration = 1;

  plateMap: PlateMap = { wells: [], columnHeaders: [], rowHeaders: [] };

  plateFormats: any[] = [];
  selectedPlate!: PlateFormat;
  prevSelectedPlate!: PlateFormat;

  private printHeadsSubscription: Subscription;
  public printHeads: PrintHead[] = [];

  plateHeight = 85.4; // mm
  plateWidth = 127.6; //mm
  plateHeightPX = this.toPX(this.plateHeight);
  plateWidthPX = this.toPX(this.plateWidth);

  private customButtonToggleStyle: any;

  constructor(
    private formsModule: FormsModule,
    private screenUtils: ScreenUtils,
    private plateFormatService: PlateFormatService,
    private printPositionService: PrintPositionService,
    private rendererFactory: RendererFactory2,
    private styleService: StyleService,
    private calibrationService: CalibrationService,
    private dataService: DataAggregatorService,
    private wellsStateService: WellsStateService,
    private rectangleSelect: SelectionRectangleComponent
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.plateFormats = plateFormatService.getPlateFormats()
    this.selectedPlate = this.plateFormats[0];
    this.prevSelectedPlate = this.selectedPlate;
    this.initializeSelectedPlate();
    this.updatePlateMap(this.selectedPlate, this.plateMap);
    this.printHeadsSubscription = new Subscription();
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
    this.printHeadsSubscription = this.printPositionService.printHeads$.subscribe(
      (printHeads: PrintHead[]) => {
        this.printHeads = printHeads;
        console.log('plate-map-component')
      }
    );
    this.customButtonToggleStyle = this.styleService.getBaseStyle('custom-button-toggle');
  }

  ngOnDestroy(): void {
    if (this.printHeadsSubscription) {
      this.printHeadsSubscription.unsubscribe();
    }
  }
  initializeSelectedPlate() {
    this.updatePlateMap(this.selectedPlate, this.plateMap);
    // this.plateFormatChanged.emit(this.selectedPlate);
    this.printPositionService.setSelectedPlate(this.selectedPlate);
  }

  onSelectedPlateChanged(event: MatSelectChange): void {
    const newSelectedPlate = event.value;

    if (newSelectedPlate !== this.prevSelectedPlate) {
      this.updatePlateMap(newSelectedPlate, this.plateMap);
      this.prevSelectedPlate = newSelectedPlate;
      this.selectedPlate = newSelectedPlate;
      console.log('newSelectedPlate: ', newSelectedPlate);
      this.printPositionService.setSelectedPlate(newSelectedPlate);

    }
  }

  updatePlateMap(selectedPlate: PlateFormat, plateMap: any, event?: MouseEvent) {
    if (this.selectedPlate) {
      this.wellsStateService.updatePlateMap(selectedPlate, event);
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

  // onMouseMove(event: MouseEvent, row: number, col: number): void {
  //   if (event.shiftKey && this.rectangleSelect.selectionRectangleStart) {
  //     // Update the ending coordinates of the selection rectangle and make it visible
  //     this.rectangleSelect.selectionRectangleVisible = true;
  //     const endRow = row;
  //     const endCol = col;
  //
  //   } else {
  //     // Hide the selection rectangle when the shift key is not pressed
  //     this.rectangleSelect.selectionRectangleVisible = false;
  //   }
  // }

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
    const buttonTopMM = this.printPositionService.getButtonTopMM(printHead, buttonIndex);
    const adjustedScaledButtonTopMM = this.scale(buttonTopMM); //- (scaledButtonWidthMM/2);
    return this.toPX(adjustedScaledButtonTopMM);
  }

  getButtonLeftPX(printHead: PrintHead, buttonIndex: number) {
    const buttonLeftMM = this.printPositionService.getButtonLeftMM(printHead, buttonIndex);
    const adjustedScaledButtonLeftMMv= this.scale(buttonLeftMM); //- (scaledButtonWidthMM/2);

    return this.toPX(adjustedScaledButtonLeftMMv);
  }

  getMergedStyles(printHead: PrintHead, button: PrintHeadButton) {
    const mergedStyle =
      {
        ...this.customButtonToggleStyle,
        'width': (this.getButtonWidthPX(printHead)) + 'px',
        'top': (this.getButtonTopPX(printHead, button.position)) + 'px',
        'left': (this.getButtonLeftPX(printHead, button.position)) + 'px',
        'background-color': button.selected ? printHead.color : 'white',
        'border': 'none'
      };
    return mergedStyle;
  }

}
