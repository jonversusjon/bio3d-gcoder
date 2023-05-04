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
  RendererFactory2,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from "rxjs";
import {ScreenUtils} from "../_services/screen-utils";
import {PlateFormatService} from '../_services/plate-format.service';
import { PlateFormat } from "../../types/PlateFormat";
import { PrintHeadStateService } from "../_services/print-head-state.service";
import { PrintHead } from "../../types/PrintHead";
import {MatSelectChange} from "@angular/material/select";
import {StyleService} from "../_services/style.service";
import {CalibrationService} from "../_services/calibration.service";
import { WellsStateService } from "../_services/wells-state.service";
import {PlateMap} from "../../types/PlateMap";
import { GcodeService } from "../_services/gcode.service";
import {PrintPositionService} from "../_services/print-position.service";
import {Coordinates} from "../../types/Coordinates";
import {ExportGcodeFormComponent} from "../export-gcode-form/export-gcode-form.component";
import {MatDialog} from "@angular/material/dialog";
import {DataAggregatorService} from "../_services/data-aggregator.service";

@Component({
  selector: 'app-plate-map',
  templateUrl: './plate-map.component.html',
  styleUrls: ['./plate-map.component.css'],
  providers: [ScreenUtils],

})
export class PlateMapComponent implements OnInit, AfterViewInit, OnDestroy {
  majorTicks = Array.from({length: 11}, (_, i) => i * 10); // 0, 10, 20, ... , 100
  minorTicks = Array.from({length: 51}, (_, i) => i * 2); // 0, 2, 4, ... , 100

  public axesPosition = {
    'x-axis': {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0
    },
    'y-axis': {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0
    }
  }

  private renderer: Renderer2;
  printHeads!: PrintHead[];

  xCalibration = 1;
  yCalibration = 1;
  zCalibration = 1;

  plateMap: PlateMap = {wells: [], columnHeaders: [], rowHeaders: []};
  plateFormats: PlateFormat[] = [];
  selectedPlate!: PlateFormat;
  prevSelectedPlate!: PlateFormat;
  selectedPlateOrigin!: string;

  plateHeightPX = this.toPX(this.plateFormatService.plateHeight);
  plateWidthPX = this.toPX(this.plateFormatService.plateWidth);

  private customButtonToggleStyle: any;
  public experimentSetupHeaderStyle: any;
  private printHeadStateSubscription!: Subscription;

  printPositionOriginsMM: Coordinates[][] = [];
  widthMajorTicks: number[] = [];
  widthMinorTicks: number[] = [];
  lengthMajorTicks: number[] = [];
  lengthMinorTicks: number[] = [];

  showMagnifier: boolean = false;
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
  xAxisOptions: Highcharts.XAxisOptions = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    title: {
      text: 'Month'
    }
  };

  yAxisOptions: Highcharts.YAxisOptions = {
    title: {
      text: 'Value'
    }
  };

  constructor(
    public gcodeService: GcodeService,
    private screenUtils: ScreenUtils,
    public plateFormatService: PlateFormatService,
    private printHeadStateService: PrintHeadStateService,
    private rendererFactory: RendererFactory2,
    private styleService: StyleService,
    private calibrationService: CalibrationService,
    private wellsStateService: WellsStateService,
    public printPositionService: PrintPositionService,
    public dialog: MatDialog,
    public dataService: DataAggregatorService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializePlateFormats();
    this.initializePrintHeadStateSubscription();
    this.updatePlateMap(this.selectedPlate, this.plateMap);
    this.subscribeToCalibrationUpdates();
  }

  ngOnInit(): void {
    this.customButtonToggleStyle = this.styleService.getBaseStyle('custom-button-toggle');
    this.experimentSetupHeaderStyle = this.styleService.getBaseStyle('experiment-setup-header');
    this.selectedPlateOrigin = this.plateFormatService.plateOrigins[2].value;

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
    this.printPositionOriginsMM[0] = this.printPositionService.getPrintPositionOriginsMM('plate-map', 'parent-element', this.selectedPlate.well_sizeMM);
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
    if (printHeads.length > 0) {
      // this.printPositionOriginsMM = printHeads.map(() => this.printPositionService.getPrintPositionOriginsMM('plate-map', this.selectedPlate.well_sizeMM));
    }
  }

  initializeSelectedPlate(plateMap: PlateMap) {
    this.updatePlateMap(this.selectedPlate, plateMap);
    this.plateFormatService.setSelectedPlate(this.selectedPlate);

  }

  onSelectedPlateChanged(event: any): void {
    const newSelectedPlate = event.value;
    if (newSelectedPlate !== this.prevSelectedPlate) {
      this.prevSelectedPlate = newSelectedPlate;
      this.selectedPlate = newSelectedPlate;
      this.plateFormatService.setSelectedPlate(newSelectedPlate);
      this.printPositionOriginsMM = [];
      for (let printHead of this.printHeads) {
        this.printPositionOriginsMM.push(
          this.printPositionService.getPrintPositionOriginsMM('plate-map', 'parent-element', this.selectedPlate.well_sizeMM)
        );
      }

      this.updatePlateMap(newSelectedPlate, this.plateMap);

      console.log('printPositionOriginsMM after: ', this.printPositionOriginsMM);
    }
    this.widthMajorTicks = this.createTickPositions(this.selectedPlate.widthMM, this.selectedPlate.lengthMM, 10, 5);
    this.widthMinorTicks = this.createTickPositions(this.selectedPlate.widthMM, this.selectedPlate.lengthMM, 10, 1);
    this.lengthMajorTicks = this.createTickPositions(this.selectedPlate.lengthMM, this.selectedPlate.widthMM, 10, 5);
    this.lengthMinorTicks = this.createTickPositions(this.selectedPlate.lengthMM, this.selectedPlate.widthMM, 10, 1);
  }

  onSelectedPlateOriginChanged(event: MatSelectChange): void {
    this.selectedPlateOrigin = event.value;
  }

  updatePlateMap(selectedPlate: PlateFormat, plateMap: PlateMap, event?: MouseEvent) {
    if (this.selectedPlate) {
      this.wellsStateService.updatePlateMap(selectedPlate, plateMap, event);
    }
  }

  get plateStyle() {
    return {
      border: '1px solid #000',
      height: `${this.plateHeightPX}px`,
      width: `${this.plateWidthPX}px`,
      backgroundColor: '#efefef',
      borderRadius: '12px'
    };
  }

  get axesStyle() {
    return {
      height: `${this.plateHeightPX}px`,
      width: `${this.plateWidthPX}px`,
      position: 'absolute',
      top: 0,
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
    const target = event.target as HTMLElement;

    // Check if the cursor is over a header or column row
    const isHeader = target.classList.contains("rowHeader") || target.classList.contains("colHeader");

    if (!isHeader) {
      // Show the magnifier if the cursor is not over a header or column row
      this.showMagnifier = true;

      this.magnifierStyle = {
        ...this.magnifierStyle,
        left: event.pageX - this.magnifierSize / 2 + 'px',
        top: event.pageY - this.magnifierSize / 2 + 'px',
      };
    } else {
      // Hide the magnifier if the cursor is over a header or column row
      this.showMagnifier = false;
    }
  }

  onMouseLeave() {
    this.showMagnifier = false;
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
  createTickPositions(length: number, width: number, majorInterval: number, minorInterval: number): number[] {
    const positions: number[] = [];

    // Add major tick positions
    for (let i = 0; i <= width; i += majorInterval) {
      positions.push(i);
    }

    // Add minor tick positions
    for (let i = minorInterval; i < width; i += minorInterval) {
      if (!positions.includes(i)) {
        positions.push(i);
      }
    }

    // Sort tick positions
    positions.sort((a, b) => a - b);

    return positions;
  }

  setAxesPosition(): void {
    switch (this.selectedPlateOrigin) {
      case 'plate-center':
        this.axesPosition = {
          'x-axis': {
            x1: 0,
            x2: 100,
            y1: 0,
            y2: 0
          },
          'y-axis': {
            x1: 0,
            x2: 100,
            y1: 0,
            y2: 0
          }
        }
        break;
      case 'top-right':
        this.axesPosition = {
          'x-axis': {
            x1: 0,
            x2: 100,
            y1: 0,
            y2: 0
          },
          'y-axis': {
            x1: 0,
            x2: 100,
            y1: 0,
            y2: 0
          }
        }
        break;
      case 'top-left':
        this.axesPosition = {
          'x-axis': {
            x1: 0,
            x2: 100,
            y1: 0,
            y2: 0
          },
          'y-axis': {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
          }
        }
        break;
      case 'bottom-right':
        this.axesPosition = {
          'x-axis': {
            x1: 0,
            x2: 100,
            y1: 0,
            y2: 0
          },
          'y-axis': {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
          }
        }
        break;
      case 'bottom-left':
        this.axesPosition = {
          'x-axis': {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
          },
          'y-axis': {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
          }
        }
        break;
      default:
        this.axesPosition = {
          'x-axis': {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
          },
          'y-axis': {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
          }
        }
        break;
    }
  }



// <line id="x-axis" x1="0" [attr.y1]="getAxisPosition().y + '%'" x2="100%" [attr.y2]="getAxisPosition().y + '%'" stroke="rgba(0,0,0,0.25)" />
//     <!-- X-Axis Major Ticks -->
// <line *ngFor="let tick of majorTicks"
//   [attr.x1]="tick + '%'"
//     [attr.y1]="getAxisPosition().y - 1 + '%'"
//     [attr.x2]="tick + '%'"
//     [attr.y2]="getAxisPosition().y + 1 + '%'"
//   stroke="rgba(0,0,0,0.25)" />
//     <!-- X-Axis Minor Ticks -->
// <line *ngFor="let tick of minorTicks"
//   [attr.x1]="tick + '%'"
//     [attr.y1]="getAxisPosition().y - 0.5 + '%'"
//     [attr.x2]="tick + '%'"
//     [attr.y2]="getAxisPosition().y + 0.5 + '%'"
//   stroke="rgba(0,0,0,0.15)" />
  getOriginLabelPosition() {
    const origin = this.selectedPlateOrigin;
    let x = 0;
    let y = 0;

    if (origin === 'plate-center') {
      x = 74;
      y = 50;
    } else if (origin === 'top-right') {
      x = 100;
      y = 0;
    } else if (origin === 'top-left') {
      x = 0;
      y = 0;
    } else if (origin === 'bottom-right') {
      x = 100;
      y = 100;
    } else if (origin === 'bottom-left') {
      x = 0;
      y = 100;
    }

    // Adjust the position to make sure the label is not overlapping with the axes
    x -= 2;
    y -= 2;

    return { x, y };
  }
  openExportGcodeForm(): void {
    this.dataService.aggregateData();
    // const dialogRef = this.dialog.open(ExportGcodeFormComponent);
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}
