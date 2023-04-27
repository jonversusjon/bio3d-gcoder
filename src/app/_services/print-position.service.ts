/*
Print Position service is in charge of calculating anything to do with sizing and positioning of
print positions inside the printHead and the plate map

  **********************************************************************************************
  this service does not subscribe to anything, all values not stored here need to be passed in
  through function arguments
  **********************************************************************************************

  **********************************************************************************************
                 this service only works with the millimeter coordinate system
                 if you need pixel values, you'll have to transform the results
                 of functions in this service
 **********************************************************************************************
 */

import {Injectable} from "@angular/core";
import {Coordinates, emptyCoordinates} from "../../types/Coordinates";
import {ScreenUtils} from "./screen-utils";

@Injectable({
  providedIn: 'root',
})


export class PrintPositionService {
  // constants //
  PRINT_POSITIONS_COUNT: number = 9; // One central print position surrounded by a ring of 8 print positions
  PRINT_PICKER_DIAM_MM: number = 34.8; // the print picker size in PX doesn't change but relative needle sizes are represented based on this

  // class variables //
  private printPositionAngles: number[] = Array.from({length: this.PRINT_POSITIONS_COUNT - 1}, (_, i) => i / (this.PRINT_POSITIONS_COUNT - 1) * 2 * Math.PI);
  constructor(private screenUtils: ScreenUtils) {}

  getButtonWidthMM(forWhichElement: 'plate-map' | 'print-head', needleOdMM: number, selectedPlateWellDiamMM?: number) {
    switch (forWhichElement) {
      case 'plate-map':
        return needleOdMM;
      case 'print-head':
        if(selectedPlateWellDiamMM) {
          // console.log('getButtonWidthMM: needleOdMM:', needleOdMM, 'plateMapWellDiamMM:', selectedPlateWellDiamMM);
          const scalar = selectedPlateWellDiamMM / this.PRINT_PICKER_DIAM_MM;
          // console.log('getButtonWidthMM returning: ', (needleOdMM / scalar));
          // console.trace();
          return needleOdMM / scalar;

        } else {
          console.warn("print-position-service couldn't calculate button width; selected plate well diam (MM) not received;");
          return 0;
        }
      default:
        console.warn("print-position-service couldn't calculate button width; for which element did not equal 'plate-map' or 'print-head'");
        return 0;
    }
  }

  getButtonLeftMM(buttonCoordinates: Coordinates[], buttonPosition: number) {
    if (buttonCoordinates[buttonPosition]) {
      return buttonCoordinates[buttonPosition].x;
    } else {
      console.warn("print-position-service couldn't calculate button left; coordinates for position ", buttonPosition, "not received;");
      return 0;
    }
  }

  getButtonTopMM(buttonCoordinates: Coordinates[], buttonPosition: number) {
    if (buttonCoordinates[buttonPosition]) {
      return buttonCoordinates[buttonPosition].y;
    } else {
      return 0;
    }
  }

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

}
