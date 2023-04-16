// TODO: print select widget - print positions should get larger when the plate map well size is smaller

import {Component} from '@angular/core';
import { PlateFormatService, Well, PlateFormat} from "../plate-format.service";
import {Coordinates} from "../../types/Coordinates";
import {ScreenUtils} from "../screen-utils";
import {PrintHead, PrintHeadButton, PrintHeadStateService} from "../printhead-state.service"
import { Subscription } from "rxjs";

@Component({
  selector: 'app-printhead-setup',
  templateUrl: './printhead-setup.component.html',
  styleUrls: ['./printhead-setup.component.css']
})
export class PrintHeadSetupComponent {
  private selectedPlateSubscription: Subscription;
  private colors: string[] = [
    '#009ADE',
    '#00CD6C',
    '#FFC61E',
    '#FF1F5B',
    '#F28522',
    '#AF58BA'
  ];

  numberOfPrintHeads: number = 1;
  printHeads: PrintHead[] = [];
  printHeadButtons: PrintHeadButton[] = [];

  printPickerSizeMM: number = 34.8;
  inactiveColor = '#808080';

  private _selectedPlate!: PlateFormat;
  constructor(
    private plateFormatService: PlateFormatService,
    private screenUtils: ScreenUtils,
    private printHeadStateService: PrintHeadStateService) {

    this.selectedPlateSubscription = this.plateFormatService.selectedPlate$.subscribe((plate) => {

      if (this.selectedPlate) {
        this.selectedPlate = plate;
      } else {
        this.selectedPlate = plateFormatService.getDefaultPlateFormat();
      }
      this.printHeadStateService.printPickerSizeMM = this.printPickerSizeMM;
      // console.log('updatePrintHeads called from selectedPlateSub');
      this.updatePrintHeads();
      this.printHeadStateService.initializeSelectedPrintHeadButtons(this.numberOfPrintHeads, this.printHeadStateService.PRINT_POSITIONS_COUNT);
    });
  }

  ngOnDestroy() {
    this.selectedPlateSubscription.unsubscribe();
  }
  updatePrintHeads() {

    const newPrintHead: PrintHead = {
      printHeadIndex: this.printHeads.length,
      description: '',
      color: this.getNextColor(),
      active: true,
      printPositionStates: Array.from({ length: this.printHeadButtons.length >= 1 ? this.printHeadButtons.length : this.printHeadStateService.PRINT_POSITIONS_COUNT }, () => false),
      printHeadButtons: Array.from({ length: this.printHeadStateService.PRINT_POSITIONS_COUNT }, (_, index) => ({
        printHead: this.printHeads.length,
        position: index,
        color: this.getNextColor(),
        selected: false,
        originPX: { x: 0, y: 0 },
        originMM: { x: 0, y: 0 },
        style: {}
      })),
      pickerWell: { sizeMM: this.printPickerSizeMM }
    };

    if (this.numberOfPrintHeads > this.printHeads.length) {
      for (let i = this.printHeads.length; i < this.numberOfPrintHeads; i++) {
        this.printHeads.push({ ...newPrintHead });
      }
    } else {
      this.printHeads = this.printHeads.slice(0, this.numberOfPrintHeads);
    }

    this.printHeads.forEach((PrintHead) => {
      this.updatePrintHeadButtons(PrintHead, undefined, true);
    });

    this.printHeadStateService.updatePrintHeads(this.printHeads);

  }

  getPrintPositionPickerStyle(isActive: boolean): object {
    if(this.selectedPlate) {
      const well_diam = this.toPX(this.selectedPlate.well_sizeMM);
      const commonStyle = {
        width: `${this.toPX(this.printPickerSizeMM)}px`,
        aspectRatio: '1 / 1',
        marginLeft: 'auto',
        marginRight: 'auto'
      }
      if(isActive) {
        return {...commonStyle}
        } else {
          return {
            ...commonStyle,
            backgroundColor: '#f8f8f8'
          }
      }
    }else {
      return {}
    }
  }
  _getPrintPositionButtonStyle(PrintHead: PrintHead, printPosition: number) {
    // console.log('called from printhead-setup-component');
    if(this.selectedPlate) {
      const pickerWell_to_plateWell_ratio = this.selectedPlate.well_sizeMM / this.printPickerSizeMM;
      const printPositionButtonStyleRaw = this.printHeadStateService.getPrintPositionButtonStyle(PrintHead, printPosition, this.printPickerSizeMM, 'printhead-setup', pickerWell_to_plateWell_ratio);
      return {
        ...printPositionButtonStyleRaw
      }
    } else {
      return {}
    }
  }

  updatePrintHeadButtons(PrintHead: PrintHead, buttonIndex?: number, updateAll: boolean = false) {
    if (updateAll) {
      this.updateAllPrintHeadButtons(PrintHead);
    } else if (buttonIndex !== undefined) {
      this.toggleButtonElectedState(PrintHead, buttonIndex);
    }
    this.updatePrintHeadStateService(PrintHead);
  }

  updateAllPrintHeadButtons(PrintHead: PrintHead) {
    if (!PrintHead.active) {
      this.setAllButtonsInactive(PrintHead);
    } else {
      this.repopulatePrintHeadButtons(PrintHead);
    }
  }

  setAllButtonsInactive(PrintHead: PrintHead) {
    PrintHead.printPositionStates = PrintHead.printPositionStates.map(() => false);
    PrintHead.printHeadButtons = PrintHead.printHeadButtons.map(button => ({ ...button, selected: false }));
  }

  repopulatePrintHeadButtons(PrintHead: PrintHead) {
    const ratio = this.selectedPlate.well_sizeMM / this.printPickerSizeMM;
    const printPositionsMM = this._getPrintPositionCoordinates(this.printHeadStateService.PRINT_POSITIONS_COUNT - 1, this.printPickerSizeMM, ratio * this.printHeadStateService.PRINT_POSITION_SIZE_MM);
    const printPositionsPX = printPositionsMM.map(position => {
      return {
        x: this.toPX(position.x),
        y: this.toPX(position.y)
      };
    });
    console.log("printPositionsPX:", printPositionsPX);
    // console.log("printPositionsMM:", printPositionsMM);

    PrintHead.printPositionStates = PrintHead.printPositionStates.map((state, index) => {

      const buttonStyle = this._getPrintPositionButtonStyle(PrintHead, index);

      PrintHead.printHeadButtons[index] = {
        printHead: PrintHead.printHeadIndex,
        position: index,
        selected: state,
        originPX: {x: printPositionsPX[index].x, y: printPositionsPX[index].y},
        originMM: {x: printPositionsMM[index].x, y: printPositionsMM[index].y},
        style: {
          ...buttonStyle
        }
      };
      // console.log('----PrintHead.printHeadButtons: ', JSON.stringify(PrintHead.printHeadButtons));
      return state;
    });

  }

  toggleButtonElectedState(PrintHead: PrintHead, buttonIndex: number) {
    PrintHead.printPositionStates[buttonIndex] = !PrintHead.printPositionStates[buttonIndex];
  }

  updatePrintHeadStateService(PrintHead: PrintHead) {
    const selectedButtons = PrintHead.printHeadButtons.filter((button, index) => {
      return PrintHead.printPositionStates[index];
    }).map(button => ({ ...button, color: PrintHead.color }));

    this.printHeadStateService.updateSelectedPrintHeadButtons(PrintHead.printHeadIndex, selectedButtons);
  }

  toPX(size_in_mm:number) {
    return this.screenUtils.convertMMToPPI(size_in_mm);
  }

  _getPrintPositionCoordinates(numDots: number, wellSize:number, dotSize:number, adj_x= 0, adj_y= 0) {
    return this.printHeadStateService.getPrintPositionCoordinates(numDots, wellSize, dotSize, adj_x, adj_y);
  }
  private getNextColor(): string {
    const currentColorIndex = this.printHeads.length % this.colors.length;
    return this.colors[currentColorIndex];
  }

  get selectedPlate(): PlateFormat {
    return this._selectedPlate;
  }

  set selectedPlate(plate: PlateFormat) {
    this._selectedPlate = plate;
  }
}
