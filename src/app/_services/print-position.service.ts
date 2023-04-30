/*
Print Position service is in charge of calculating anything to do with sizing and positioning of
print positions inside the printHead and the plate map

  **********************************************************************************************
  this service does not subscribe to anything, all values not stored here need to be passed in
  through function arguments
  **********************************************************************************************
 */

import {Injectable} from "@angular/core";
import { Subject } from 'rxjs';
import {Coordinates} from "../../types/Coordinates";
import {ScreenUtils} from "./screen-utils";
import {PrintHeadButton, emptyPrintHeadButton} from "../../types/PrintHeadButton";
import {PlateFormatService} from "./plate-format.service";
import {StyleService} from "./style.service";
import {PrintHead} from "../../types/PrintHead";

@Injectable({
  providedIn: 'root',
})

export class PrintPositionService {
  // constants //
  PRINT_POSITIONS_COUNT: number = 9; // One central print position surrounded by a ring of 8 print positions
  PRINT_PICKER_DIAM_MM: number = 34.8; // the print picker size in PX doesn't change but relative needle sizes are represented based on this
  // in angular the actual width of anything is calculated as computedWidth = specifiedWidth + (borderLeftWidth + borderRightWidth) + (paddingLeft + paddingRight)
  BUTTON_MIN_WIDTH_PX: number = 7;
  public customButtonToggleStyle: any;

  // class variables //
  private printPositionAngles: number[] = Array.from({length: this.PRINT_POSITIONS_COUNT - 1}, (_, i) => i / (this.PRINT_POSITIONS_COUNT - 1) * 2 * Math.PI);
  printPositionOriginsMM:Coordinates[] = []
  printPositionOriginsPct:Coordinates[] = [];

  public printPositionButtonTopsPX:number[] = [];
  public printPositionButtonLeftsPX:number[] = [];
  public printPositionButtonWidthPX: number[] = [9];
  public printPositionButtonWidthPX_PlateMap: number[] = [9];
  public toScale: boolean = false;

  buttonWidthChanged = new Subject<void>();

  constructor(private screenUtils: ScreenUtils,
              private plateFormatService: PlateFormatService,
              private styleService: StyleService,
             ) {
    this.customButtonToggleStyle = this.styleService.getBaseStyle('custom-button-toggle');
    this.printPositionOriginsMM = this.getPrintPositionOriginsMM('print-head', this.plateFormatService.getPlateFormats()[0].well_sizeMM)
    this.printPositionOriginsPct = this.getPrintPositionOriginsPct(this.plateFormatService.getPlateFormats()[0].well_sizeMM);
  }

  getButtonWidthMM(forWhichElement: 'plate-map' | 'print-head', selectedPlateWellDiamMM: number, needleOdMM: number) {
    switch (forWhichElement) {
      case 'plate-map':
        return needleOdMM;
      case 'print-head':
          const scalar = selectedPlateWellDiamMM / this.PRINT_PICKER_DIAM_MM;
          return needleOdMM / scalar;
      default:
        console.warn("print-position-service couldn't calculate button width; for which element did not equal 'plate-map' or 'print-head'");
        return 0;
    }
  }

  // getButtonLeftMM(buttonCoordinates: Coordinates[], buttonPosition: number) {
  //   if (buttonCoordinates[buttonPosition]) {
  //     return buttonCoordinates[buttonPosition].x;
  //   } else {
  //     console.warn("print-position-service couldn't calculate button left; coordinates for position ", buttonPosition, "not received;");
  //     return 0;
  //   }
  // }
  //
  // getButtonTopMM(buttonCoordinates: Coordinates[], buttonPosition: number) {
  //   if (buttonCoordinates[buttonPosition]) {
  //     return buttonCoordinates[buttonPosition].y;
  //   } else {
  //     return 0;
  //   }
  // }

  // getPrintPositionCoordinates(parentType: 'PrintHead' | 'Well', dotSizeMM:number, adj_x= 0, adj_y= 0) {
  getPrintPositionOriginsMM(forWhichElement: 'plate-map' | 'print-head', selectedPlateWellDiamMM: number, adj_x= 0, adj_y= 0) {
    const wellSizeMM = forWhichElement === 'print-head' ? this.PRINT_PICKER_DIAM_MM : selectedPlateWellDiamMM;
    if(wellSizeMM) {
      const radiusMM = (0.7 * wellSizeMM) / 2;
      const centerX_MM = wellSizeMM / 2;
      const centerY_MM = wellSizeMM / 2;

      const printPositionOriginsMM: Coordinates[] = this.printPositionAngles.map(angle => ({
        x: centerX_MM + radiusMM * Math.cos(angle),
        y: centerY_MM + radiusMM * Math.sin(angle)
      }));

      let adjustedPrintPositionOriginsMM: Coordinates[] = [{
        x: centerX_MM + adj_x,
        y: centerY_MM + adj_y,
        label: "0"
      }];

      for (let i = 0; i < this.PRINT_POSITIONS_COUNT - 1; i++) {
        adjustedPrintPositionOriginsMM.push({
          'x': (printPositionOriginsMM[i].x  + adj_x),
          'y': (printPositionOriginsMM[i].y  + adj_y)
        });
      }
      return adjustedPrintPositionOriginsMM;
    } else {
      console.warn("Print position service couldn't determine print position coordinates; could not determine well size (MM)");
      return [];
    }
  }

  getPrintPositionOriginsPct(selectedPlateWellDiamMM: number) {
    const printPositionOriginsMM = this.printPositionOriginsMM;

    return printPositionOriginsMM.map(coordinate => ({
      x: (coordinate.x / selectedPlateWellDiamMM) * 100,
      y: (coordinate.y / selectedPlateWellDiamMM) * 100,
    }));
  }

  loadPrintPositionButtons(forWhichElement: 'plate-map' | 'print-head',
                           parentIndex: number,
                           selectedPlateWellDiamMM: number,
                           needleOdMM: number,
                           adj_x = 0, adj_y = 0): PrintHeadButton[] {
    const printPositionOriginsMM = this.getPrintPositionOriginsMM(forWhichElement, selectedPlateWellDiamMM, adj_x, adj_y);
    return printPositionOriginsMM.map((coordinates, index) => {
      const button = emptyPrintHeadButton();

      // add the properties that don't change
      button.parentIndex = parentIndex;
      button.position = index;
      button.originMM = coordinates;

      return button;
    });
  }


  getNewButtonsSize(forWhichElement: 'plate-map' | 'print-head', printHead: PrintHead, plateMapWellSize: number, needleOdMM: number) {
    // Calculate the new button width, top, and width based on the needle selection
    const printPositionButtonWidthMM = this.getButtonWidthMM('print-head', plateMapWellSize, needleOdMM);
    const printPositionButtonWidthMM_PlateMap = this.getButtonWidthMM('plate-map', plateMapWellSize, needleOdMM)
    const calculatedButtonWidthPX = this.toPX(printPositionButtonWidthMM);
    const printPositionButtonWidthPX_PlateMap = this.toPX(printPositionButtonWidthMM_PlateMap);

    // Check if the printPositionButtonWidthPX array length is at least (printHeadIndex + 1)
    if (this.printPositionButtonWidthPX.length <= printHead.printHeadIndex) {
      // Extend the array
      this.printPositionButtonWidthPX.length = printHead.printHeadIndex + 1;
      this.printPositionButtonWidthPX_PlateMap.length = printHead.printHeadIndex + 1;
    }

    // Set the value for the printHeadIndex
    this.printPositionButtonWidthPX[printHead.printHeadIndex] = calculatedButtonWidthPX < this.BUTTON_MIN_WIDTH_PX ? this.BUTTON_MIN_WIDTH_PX : calculatedButtonWidthPX;
    this.printPositionButtonWidthPX_PlateMap[printHead.printHeadIndex] = printPositionButtonWidthPX_PlateMap;
    this.toScale = calculatedButtonWidthPX > this.BUTTON_MIN_WIDTH_PX;

    printHead.printPositionButtons.forEach(button => {
      button.widthPX = this.printPositionButtonWidthPX[printHead.printHeadIndex];
    });
    console.log('this.printPositionButtonWidthPX: ', this.printPositionButtonWidthPX);
    console.log('this.printPositionButtonWidthPX_PlateMap: ', this.printPositionButtonWidthPX_PlateMap);
    this.buttonWidthChanged.next();
  }

  toPX(size_in_mm: number, message?: string) {
    return this.screenUtils.convertMMToPX(size_in_mm, message);
  }

}
