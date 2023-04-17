// TODO: print select widget - print positions should get larger when the plate map well size is smaller

import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import { PlateFormatService } from "../plate-format.service";
import { PlateFormat } from "../../types/PlateFormat";
import { ScreenUtils } from "../screen-utils";
import { PrintPositionService } from "../print-position.service"
import { PrintHead } from "../../types/PrintHead";
import { PrintHeadButton } from "../../types/PrintHeadButton";
import { Well } from "../../types/Well";
import { Coordinates } from "../../types/Coordinates";

@Component({
  selector: 'app-printhead-component',
  templateUrl: './printhead.component.html',
  styleUrls: ['./printhead.component.css']
})
export class PrintheadComponent implements OnInit {
  @Input() printHeadChanged!: EventEmitter<number>;
  @Input() plateFormatChanged!: EventEmitter<PlateFormat>;

  // private selectedPlateSubscription: Subscription;
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

  // private _selectedPlate!: PlateFormat;
  constructor(
    private plateFormatService: PlateFormatService,
    private screenUtils: ScreenUtils,
    private printPositionService: PrintPositionService) {

    // this.selectedPlateSubscription = this.plateFormatService.selectedPlate$.subscribe((plate) => {

      // if (this.selectedPlate) {
      //   this.selectedPlate = plate;
      // } else {
      //   this.selectedPlate = plateFormatService.getDefaultPlateFormat();
      // }
      // this.printHeadStateService.printPickerSizeMM = this.printPickerSizeMM;
      // // console.log('updatePrintHeads called from selectedPlateSub');
      // this.updatePrintHeads();
      // this.printHeadStateService.initializeSelectedPrintHeadButtons(this.numberOfPrintHeads, this.printHeadStateService.PRINT_POSITIONS_COUNT);
    // });
  }

ngOnInit() {
  // Subscribe to the events
  this.printHeadChanged.subscribe((newNumberOfPrintHeads) => {
    // Update print position buttons
    const newButtons = this.printPositionService.generatePrintPositionButtons(/* parameters */);
    // Update component state with new buttons
  });

}
  // ngOnDestroy() {
  //   this.selectedPlateSubscription.unsubscribe();
  // }
  updatePrintHeads() {

    const newPrintHead: PrintHead = {
      printHeadIndex: this.printHeads.length,
      description: '',
      color: this.getNextColor(),
      active: true,
      // printPositionStates: Array.from({ length: this.printHeadButtons.length >= 1 ? this.printHeadButtons.length : this.printPositionService.PRINT_POSITIONS_COUNT }, () => false),
      printPositionButtons: Array.from({ length: this.printPositionService.PRINT_POSITIONS_COUNT }, (_, index) => ({
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

    this.printPositionService.updatePrintHeads(this.printHeads);

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
    // console.log('called from printhead-component-component');
    if(this.selectedPlate) {
      const pickerWell_to_plateWell_ratio = this.selectedPlate.well_sizeMM / this.printPickerSizeMM;
      const printPositionButtonStyleRaw = this.printPositionService.getPrintPositionButtonStyle(PrintHead, printPosition, this.printPickerSizeMM, 'printhead-component', pickerWell_to_plateWell_ratio);
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

  updateAllPrintHeadButtons(printHead: PrintHead) {
    if (!printHead.active) {
      this.setAllButtonsInactive(printHead);
    } else {
      this.printPositionService.repopulatePrintPositionButtons(this.selectedPlate.well_sizeMM, printHead, undefined);
    }
  }

  setAllButtonsInactive(PrintHead: PrintHead) {
    PrintHead.printPositionButtons.map(button => {
      return {...button, selected: false};
    });
  }

  toggleButtonElectedState(PrintHead: PrintHead, buttonIndex: number) {
    PrintHead.printPositionButtons[buttonIndex].selected = !PrintHead.printPositionButtons[buttonIndex].selected
  }

  updatePrintHeadStateService(PrintHead: PrintHead) {
    const selectedButtons = PrintHead.printPositionButtons.filter((button: PrintHeadButton, index: number) => {
      return PrintHead.printPositionButtons[index].selected == true;
    }).map((button: any) => ({ ...button, color: PrintHead.color }));

    this.printPositionService.updateSelectedPrintHeadButtons(PrintHead.printHeadIndex, selectedButtons);
  }

  toPX(size_in_mm:number) {
    return this.screenUtils.convertMMToPPI(size_in_mm);
  }

  _getPrintPositionCoordinates(numDots: number, wellSize:number, dotSize:number, adj_x= 0, adj_y= 0) {
    return this.printPositionService.getPrintPositionCoordinates(numDots, wellSize, dotSize, adj_x, adj_y);
  }
  private getNextColor(): string {
    const currentColorIndex = this.printHeads.length % this.colors.length;
    return this.colors[currentColorIndex];
  }

  get selectedPlate(): PlateFormat {
    return this.selectedPlate;
  }

  set selectedPlate(plate: PlateFormat) {
    this.selectedPlate = plate;
  }
}

