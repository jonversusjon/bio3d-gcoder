import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { PlateFormatService } from '../plate-format.service';
import { Coordinates} from "../../types/Coordinates";
import { PlateFormat} from "../../types/PlateFormat";
import { ScreenUtils } from "../screen-utils";
import { PrintHeadStateService, PrintHeadButton } from "../printhead-state-service.service"
import { PrintHead } from "../printhead-state-service.service";

@Component({
  selector: 'app-printhead-setup',
  templateUrl: './printhead-setup.component.html',
  styleUrls: ['./printhead-setup.component.css']
})
export class PrintheadSetupComponent {
  @Input() selectedPlate!: PlateFormat;
  private colors: string[] = [
    '#FF1F5B',
    '#00CD6C',
    '#FFC61E',
    '#009ADE',
    '#F28522',
    '#AF58BA'
  ];

  numberOfPrintheads: number = 1;
  printHeads: PrintHead[] = [];
  printPositions: any[] = [];

  printPickerSize: number = 34.8;
  inactiveColor = '#808080';

  constructor(
    private plateFormatService: PlateFormatService,
    private screenUtils: ScreenUtils,
    private printHeadStateService: PrintHeadStateService) {

    this.plateFormatService.selectedPlate$.subscribe((plate) => {
      if(this.selectedPlate) {
        this.selectedPlate = plate;
      } else {
        this.selectedPlate = plateFormatService.getDefaultPlateFormat();
      }
      // Perform any necessary updates based on the new selectedPlate value
      // Assuming you have a reference to the PrintheadStateService as 'printHeadStateService'
      this.printHeadStateService.printPickerSize = this.printPickerSize;
      this.updatePrintheads();
      this.printHeadStateService.initializeSelectedPrintheadButtons(this.numberOfPrintheads, this.printHeadStateService.PRINT_POSITIONS_COUNT);
    });
  }
  ngOnInit(): void {}

  updatePrintheads() {

    const newPrintHead: PrintHead = {
      printHeadIndex: this.printHeads.length,
      description: '',
      color: this.getNextColor(),
      active: true,
      printPositionStates: Array.from({ length: this.printPositions.length >= 1 ? this.printPositions.length : this.printHeadStateService.PRINT_POSITIONS_COUNT }, () => false),
      printHeadButtons: [],
      pickerWell: { size: this.printPickerSize }
    };

    if (this.numberOfPrintheads > this.printHeads.length) {
      for (let i = this.printHeads.length; i < this.numberOfPrintheads; i++) {
        this.printHeads.push({ ...newPrintHead });
      }
    } else {
      this.printHeads = this.printHeads.slice(0, this.numberOfPrintheads);
    }

    this.printHeads.forEach((printhead) => {
      console.log('printHeads.forEach: ', JSON.stringify(printhead));
      this.updatePrintheadButtons(printhead, undefined, true);
    });

    this.printHeadStateService.updatePrintHeads(this.printHeads);

  }

  getWellStyle() {
    if (!this.selectedPlate) {
      return {
        'border-radius': '50%',
        'background-color': '#ccc',
        'position': 'relative'};
    }
    const size = this.selectedPlate.well_size;
    return {
      'width': `${size}px`,
      'height': `${size}px`,
      'border-radius': '50%',
      'background-color': '#ccc',
      'position': 'relative'
    };
  }
  getPrintPositionPickerStyle(isActive: boolean): object {
    if(this.selectedPlate) {
      const well_diam = this.toPX(this.selectedPlate.well_size);
      const commonStyle = {
        width: `${well_diam}px`,
        height: `${well_diam}px`,
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
  _getPrintPositionButtonStyle(printHead: PrintHead, printPosition: number, well_size?: number) {
    if(this.selectedPlate) {
      return this.printHeadStateService.getPrintPositionButtonStyle(printHead, printPosition, this.selectedPlate.well_size);
    } else {
      return {}
    }
  }

  // updatePrintPositions() {
  //   // Define the button positions here.
  //   // You can adjust the x and y values to position the buttons as needed.
  //   const well_diam = this.selectedPlate.well_size;
  //   this.printPositions = this.getPrintPositionCoordinates(8,this.toPX(well_diam), this.toPX(this.printPositionSizeMM));
  // }

  updatePrintheadButtons(printhead: PrintHead, buttonIndex?: number, updateAll: boolean = false) {
    if (updateAll && !printhead.active) {
      printhead.printPositionStates = printhead.printPositionStates.map(() => false);
      printhead.printHeadButtons = printhead.printHeadButtons.map(button => ({
        ...button,
        selected: false
      }));
    } else { //update All and the printhead is active
      if (updateAll) {
        this.printPositions = this.getPrintPositionCoordinates(8,this.toPX(this.printPickerSize), this.toPX(this.printHeadStateService.PRINT_POSITION_SIZE_MM));
        printhead.printPositionStates = printhead.printPositionStates.map((state, index) => {
          const button: PrintHeadButton = {
            printHead: printhead.printHeadIndex,
            position: index,
            color: printhead.color,
            selected: state,
            coordinates: {x:this.printPositions[index].x, y:this.printPositions[index].y}
          };
          printhead.printHeadButtons[index] = button;
          return state;
        });
      } else if (buttonIndex !== undefined) { // Execute this part only when pressing an individual printpositionbutton

        printhead.printPositionStates[buttonIndex] = !printhead.printPositionStates[buttonIndex];

      }
    }

    // Update selected printhead buttons
    const selectedButtons = printhead.printHeadButtons.filter((button, index) => {
      return printhead.printPositionStates[index];
    }).map(button => ({ ...button, color: printhead.color }));

    this.printHeadStateService.updateSelectedPrintheadButtons(printhead.printHeadIndex, selectedButtons);
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
}
