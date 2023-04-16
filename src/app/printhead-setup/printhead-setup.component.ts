// TODO: print select widget - print positions should get larger when the plate map well size is smaller

import {Component, Input} from '@angular/core';
import {PlateFormatService} from '../plate-format.service';
import {Coordinates} from "../../types/Coordinates";
import {ScreenUtils} from "../screen-utils";
import {PrintHead, PrintHeadStateService} from "../printhead-state.service"
import { Subscription } from "rxjs";
import {PlateFormat} from "../../types/PlateFormat";

@Component({
  selector: 'app-printhead-setup',
  templateUrl: './printhead-setup.component.html',
  styleUrls: ['./printhead-setup.component.css']
})
export class PrintHeadSetupComponent {
  private selectedPlateSubscription: Subscription;
  private colors: string[] = [
    '#FF1F5B',
    '#00CD6C',
    '#FFC61E',
    '#009ADE',
    '#F28522',
    '#AF58BA'
  ];

  numberOfPrintHeads: number = 1;
  printHeads: PrintHead[] = [];
  printPositions: any[] = [];

  printPickerSize: number = 34.8;
  inactiveColor = '#808080';

  private _selectedPlate!: PlateFormat;
  constructor(
    private plateFormatService: PlateFormatService,
    private screenUtils: ScreenUtils,
    private printHeadStateService: PrintHeadStateService) {

    this.selectedPlateSubscription = this.plateFormatService.selectedPlate$.subscribe((plate) => {
      console.log('Selected plate changed:', plate);
      if (this.selectedPlate) {
        this.selectedPlate = plate;
      } else {
        this.selectedPlate = plateFormatService.getDefaultPlateFormat();
      }
      this.printHeadStateService.printPickerSize = this.printPickerSize;
      console.log('updatePrintHeads called from selectedPlateSub');
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
      printPositionStates: Array.from({ length: this.printPositions.length >= 1 ? this.printPositions.length : this.printHeadStateService.PRINT_POSITIONS_COUNT }, () => false),
      printHeadButtons: [],
      pickerWell: { size: this.printPickerSize }
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
      const well_diam = this.toPX(this.selectedPlate.well_size);
      const commonStyle = {
        width: `${this.toPX(this.printPickerSize)}px`,
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
    if(this.selectedPlate) {
      const pickerWell_to_plateWell_ratio = this.printPickerSize / this.selectedPlate.well_size;
      const printPositionButtonStyleRaw = this.printHeadStateService.getPrintPositionButtonStyle(PrintHead, printPosition, this.selectedPlate.well_size);
      return {
        ...printPositionButtonStyleRaw,
        width: `${this.toPX(this.printHeadStateService.PRINT_POSITION_SIZE_MM) * pickerWell_to_plateWell_ratio}px`
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
    const ratio = this.selectedPlate.well_size / this.printPickerSize;
    this.printPositions = this.getPrintPositionCoordinates(this.printHeadStateService.PRINT_POSITIONS_COUNT - 1, this.toPX(this.printPickerSize), this.toPX(this.printHeadStateService.PRINT_POSITION_SIZE_MM));
    PrintHead.printPositionStates = PrintHead.printPositionStates.map((state, index) => {
      PrintHead.printHeadButtons[index] = {
        printHead: PrintHead.printHeadIndex,
        position: index,
        color: PrintHead.color,
        selected: state,
        coordinates: {x: this.printPositions[index].x, y: this.printPositions[index].y}
      };
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



  getPrintPositionCoordinates(numDots: number, wellSize:number, dotSize:number, adj_x= 0, adj_y= 0) {
    const radius = (0.8 * wellSize ) / 2;
    const angles = Array.from({length: numDots}, (_, i) => i / numDots * 2 * Math.PI);

    const x = angles.map(angle => radius * Math.cos(angle));
    const y = angles.map(angle => radius * Math.sin(angle));

    let printPositionCoordinates: Coordinates[] = [{ x: - (dotSize/2) + adj_x, y: - (dotSize/2) + adj_y, label: "0" }];
    for (let i = 0; i < numDots; i++) {
      printPositionCoordinates.push({'x': (x[i] - (dotSize/2) + adj_x), 'y': (y[i] - (dotSize/2) + adj_y)});
    }

    return printPositionCoordinates;
  }

  toPX(size_in_mm:number) {
    return this.screenUtils.convertMMToPPI(size_in_mm);
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
