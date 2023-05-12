/*
Print Position service is in charge of calculating anything to do with sizing and positioning of
print positions inside the printHead and the plate map

This code updates the following properties of the PrintHeadButton objects:

  parentIndex:       The index of the parent print head.
  position:          The index of the print position within the print head.
  originMM:          **For display purposes**  The coordinates of the print position origin in millimeters relative
                                               to the parent element
  originMM_relative: **For calculating GCODE** The coordinates of the print position origin in millimeters relative
                                               to the point (0,0)
  widthPX:           The width of the button in pixels. This is updated in the getNewButtonsSize method based on
                     the selected needle diameter and plate map well size.

Additionally, the code updates the following properties related to print head buttons but not part of the
PrintHeadButton object:

  printPositionButtonWidthPX:          An array that stores the button width in pixels for each print head index
                                       in the 'print-head' element.
  printPositionButtonWidthPX_PlateMap: An array that stores the button width in pixels for each print head index
                                       in the 'plate-map' element.
  toScale:                             A boolean indicating if the calculated button width in pixels is greater than
                                       the minimum button width in pixels.

  **********************************************************************************************
  this service does not subscribe to anything, all values not stored here need to be passed in
  through function arguments
  **********************************************************************************************
 */

import {Injectable} from "@angular/core";
import { Subject } from 'rxjs';
import {Coordinates} from "../../types/Coordinates";
import {ScreenUtils} from "./screen-utils";
import {PrintPosition, emptyPrintPosition} from "../../types/PrintPosition";
import {PlateFormatService} from "./plate-format.service";
import {StyleService} from "./style.service";
import {PrintHead} from "../../types/PrintHead";
import {PrintHeadStateService} from "./print-head-state.service";
import {Well} from "../../types/Well";

@Injectable({
  providedIn: 'root',
})

/**
 * Service responsible for handling print positions, including
 * calculating button sizes and origins, as well as loading print position buttons.
 */
export class PrintPositionService {
  // constants //
  PRINT_POSITIONS_COUNT: number = 9; // One central print position surrounded by a ring of 8 print positions
  PRINT_PICKER_DIAM_MM: number = 34.8; // the print picker size in PX doesn't change but relative needle sizes are represented based on this
  // in angular the actual width of anything is calculated as computedWidth = specifiedWidth + (borderLeftWidth + borderRightWidth) + (paddingLeft + paddingRight)
  BUTTON_MIN_WIDTH_PX: number = 7;
  public customButtonToggleStyle: any;

  // class variables //
  private printPositionAngles: number[] = Array.from({length: this.PRINT_POSITIONS_COUNT - 1}, (_, i) => i / (this.PRINT_POSITIONS_COUNT - 1) * 2 * Math.PI);
  printPositionOriginsMM_PrintHead:Coordinates[] = [];
  printPositionOriginsPct:Coordinates[] = [];

  public printPositionButtonTopsPX:number[] = [];
  public printPositionButtonLeftsPX:number[] = [];
  public printPositionButtonWidthPX: number[] = [9];
  public printPositionButtonWidthPX_PlateMap: number[] = [9];
  public toScale: boolean = false;

  printPositionsChanged = new Subject<PrintPosition[]>();

  /**
   * Creates a new instance of the PrintPositionService.
   * @param {ScreenUtils} screenUtils - An instance of ScreenUtils for converting units.
   * @param {PlateFormatService} plateFormatService - An instance of PlateFormatService for accessing plate format information.
   * @param {StyleService} styleService - An instance of StyleService for accessing styles.
   */
  constructor(private screenUtils: ScreenUtils,
              private plateFormatService: PlateFormatService,
              private styleService: StyleService,
             ) {
    this.customButtonToggleStyle = this.styleService.getBaseStyle('custom-button-toggle');
    this.printPositionOriginsMM_PrintHead = this.getPrintPositionOriginsMM(
      'print-head',
      'parent-element',
      this.plateFormatService.getPlateFormats()[0].well_sizeMM
    )
    this.printPositionOriginsPct = this.getPrintPositionOriginsPct(this.plateFormatService.getPlateFormats()[0].well_sizeMM);
  }

  /**
   * Calculate the button width in millimeters.
   * @param {'plate-map' | 'print-head'} forWhichElement - The element for which the button width is being calculated.
   * @param {number} selectedPlateWellDiamMM - The diameter of the selected plate well in millimeters.
   * @param {number} needleOdMM - The outer diameter of the needle in millimeters.
   * @returns {number} The calculated button width in millimeters.
   */
  getButtonWidthMM(forWhichElement: 'Well' | 'PrintHead', selectedPlateWellDiamMM: number, needleOdMM: number) {
    switch (forWhichElement) {
      case 'Well':
        return needleOdMM;
      case 'PrintHead':
          const scalar = selectedPlateWellDiamMM / this.PRINT_PICKER_DIAM_MM;
          return needleOdMM / scalar;
      default:
        console.warn("print-position-service couldn't calculate button width; for which element did not equal 'plate-map' or 'print-head'");
        return 0;
    }
  }

  /**
   * Calculate print position origins in millimeters.
   * @param {'plate-map' | 'print-head'} forWhichElement - The element for which the print position origins are being calculated.
   * @param {'xy-plane' | 'parent-element'} centerRelativeTo - Whether the center is relative to the XY plane or the parent element.
   * @param {number} selectedPlateWellDiamMM - The diameter of the selected plate well in millimeters.
   * @param {number} [adj_x=0] - The x adjustment.
   * @param {number} [adj_y=0] - The y adjustment.
   * @returns {Coordinates[]} An array of calculated print position origins in millimeters.
   */
  getPrintPositionOriginsMM(forWhichElement: 'plate-map' | 'print-head',
                            centerRelativeTo: 'xy-plane' | 'parent-element',
                            selectedPlateWellDiamMM: number,
                            adj_x= 0, adj_y= 0) {
    // selecting center relative to xy-plane returns coordinates around the point(0,0)
    // selecting center relative to parent-element returns coordinates around the point(radius,radius) of the parent element

    const wellSizeMM = forWhichElement === 'print-head' ? this.PRINT_PICKER_DIAM_MM : selectedPlateWellDiamMM;
    if(wellSizeMM) {
      const radiusMM = (0.7 * wellSizeMM) / 2;
      const centerX_MM = centerRelativeTo === 'parent-element' ? wellSizeMM / 2 : 0;
      const centerY_MM = centerRelativeTo === 'parent-element' ? wellSizeMM / 2 : 0;

      // const printPositionOriginsMM: Coordinates[] = this.printPositionAngles.map(angle => ({
      //   x: centerX_MM + (radiusMM * Math.cos(angle)),
      //   y: centerY_MM + (radiusMM * Math.sin(angle))
      // }));

      const printPositionOriginsMM: Coordinates[] = this.printPositionAngles.map(angle => {
        const x = centerX_MM + (radiusMM * Math.cos(angle));
        const y = centerY_MM + (radiusMM * Math.sin(angle));
        if(centerRelativeTo === 'xy-plane') {
          // console.log(`angle: ${angle}, x: ${x}, y: ${y}`);
        }
        return { x, y };
      });

      // console.log('printPositionOriginsMM[', forWhichElement, ': ', printPositionOriginsMM);
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
      // console.log('adjustedPrintPositionOriginsMM[', forWhichElement, ': ', adjustedPrintPositionOriginsMM);
      return adjustedPrintPositionOriginsMM;
    } else {
      console.warn("Print position service couldn't determine print position coordinates; could not determine well size (MM)");
      return [];
    }
  }

  /**
   * Calculate print position origins as a percentage.
   * @param {number} selectedPlateWellDiamMM - The diameter of the selected plate well in millimeters.
   * @returns {Coordinates[]} An array of calculated print position origins as a percentage.
   */
  getPrintPositionOriginsPct(selectedPlateWellDiamMM: number) {
    const printPositionOriginsMM = this.printPositionOriginsMM_PrintHead;

    return printPositionOriginsMM.map(coordinate => ({
      x: (coordinate.x / selectedPlateWellDiamMM) * 100,
      y: (100 - (coordinate.y / selectedPlateWellDiamMM) * 100), // subtract y from 100 to flip y-axis
    }));
  }


/**
 * Load print position buttons.
 * @param {'plate-map' | 'print-head'} forWhichElement - The element for which the print position buttons are being loaded.
 * @param {number} parentIndex - The index of the parent element.
 * @param {number} selectedPlateWellDiamMM - The diameter of the selected plate well in millimeters.
 * @param {number} needleOdMM - The outer diameter of the needle in millimeters.
 * @param {number} [adj_x=0] - The x adjustment.
 * @param {number} [adj_y=0] - The y adjustment.
 * @returns {PrintPosition[]} An array of loaded print position buttons.
 * */
loadPrintPositionButtons(forWhichElement: 'plate-map' | 'print-head',
                         parentIndex: number,
                         selectedPlateWellDiamMM: number,
                         needleOdMM: number,
                         adj_x = 0, adj_y = 0): PrintPosition[] {
  const printPositionOriginsMM_display = this.getPrintPositionOriginsMM(forWhichElement, 'parent-element', selectedPlateWellDiamMM, adj_x, adj_y);
  const printPositionOriginsMM_absolute = this.getPrintPositionOriginsMM(
    forWhichElement,
    'xy-plane',
    selectedPlateWellDiamMM, adj_x, adj_y);
  const printPositions = printPositionOriginsMM_display.map((coordinates, index) => {
    const printPosition = emptyPrintPosition();

    // add the properties that don't change
    printPosition.parentIndex = parentIndex;
    printPosition.index = index;
    printPosition.originMM_display = coordinates;
    printPosition.originMM_absolute = printPositionOriginsMM_absolute[index];

    return printPosition;
  });

  // Emit the new print positions
  this.printPositionsChanged.next(printPositions);
  return printPositions;
}
  updatePrintPositionsBasedOnNeedle(component: PrintHead | Well, wellSizeMM: number, needleODMM: number): PrintPosition[] {
    // Get the current print positions
    const currentPrintPositions:PrintPosition[] = component.printPositions;

    // If there's no current print positions, return an empty array
    if (!currentPrintPositions) {
      console.error(`No current print positions for component ${component} index ${component.index}`);
      return [];
    }

    // Create a new array for the updated print positions
    const updatedPrintPositions: PrintPosition[] = [];

    // For each current print position...
    for (let i = 0; i < currentPrintPositions.length; i++) {
      // Copy the current print position
      const updatedPrintPosition = {...currentPrintPositions[i]};

      // Update the size of the print position based on the needle outer diameter
      updatedPrintPosition.button.widthPX = this.toPX(this.getButtonWidthMM(component.elementType, wellSizeMM, needleODMM));

      // Add the updated print position to the array
      updatedPrintPositions.push(updatedPrintPosition);
    }

    // Return the updated print positions
    return updatedPrintPositions;
  }

  /**
   Convert a size in millimeters to pixels.
   @param {number} size_in_mm - The size in millimeters.
   @param {string} [message] - Optional message for debugging purposes.
   @returns {number} The size in pixels.
   */
  toPX(size_in_mm: number, message?: string) {
    return this.screenUtils.convertMMToPX(size_in_mm, message);
  }

}
