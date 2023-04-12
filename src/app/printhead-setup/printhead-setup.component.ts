import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { PlateFormatService } from '../plate-format.service';
import { Coordinates} from "../../types/Coordinates";
import { PlateFormat} from "../../types/PlateFormat";
import { ScreenUtils } from "../screen-utils";

interface PrintHead {
  description: string;
  color: string;
  active: boolean;
}

@Component({
  selector: 'app-printhead-setup',
  templateUrl: './printhead-setup.component.html',
  styleUrls: ['./printhead-setup.component.css']
})
export class PrintheadSetupComponent implements OnChanges {
  @Input() selectedPlate!: PlateFormat;
  private colors: string[] = [
    '#FF1F5B',
    '#00CD6C',
    '#FFC61E',
    '#009ADE',
    '#F28522',
    '#AF58BA'
  ];
  ngOnChanges(changes: SimpleChanges) {

  }

  numberOfPrintheads: number = 1;
  printHeads: PrintHead[] = [];
  printPositions: any[] = [];
  printPositionSizeMM = 3;
  constructor(
    private plateFormatService: PlateFormatService,
    private screenUtils: ScreenUtils) {

    this.plateFormatService.selectedPlate$.subscribe((plate) => {
      if(this.selectedPlate) {
        this.selectedPlate = plate;
      } else {
        this.selectedPlate = plateFormatService.getDefaultPlateFormat();
      }
      // Perform any necessary updates based on the new selectedPlate value
      this.updatePrintheads();
      this.updatePrintPositions();
    });
  }
  ngOnInit(): void {}

  updatePrintheads() {

    const newPrintHead: PrintHead = {
      description: '',
      color: this.getNextColor(),
      active: true
    };

    if (this.numberOfPrintheads > this.printHeads.length) {
      for (let i = this.printHeads.length; i < this.numberOfPrintheads; i++) {
        this.printHeads.push({ ...newPrintHead });
      }
    } else {
      this.printHeads = this.printHeads.slice(0, this.numberOfPrintheads);
    }
    if(this.selectedPlate) {
      this.updatePrintPositions();
    }
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
            backgroundColor: 'lightgrey'
          }
      }
    }else {
      return {}
    }
  }
  getPrintPositionButtonStyle(position: { x: number; y: number }, printhead: any) {
    if(this.selectedPlate) {
      const radius = this.toPX(this.selectedPlate.well_size) / 2;
      const buttonSize = this.toPX(this.printPositionSizeMM)
      return {
        backgroundColor: printhead.color,
        left: `${position.x + radius}px`,
        top: `${position.y + radius }px`,
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
      };
    } else {
      return {}
    }
  }

  updatePrintPositions() {
    // Define the button positions here.
    // You can adjust the x and y values to position the buttons as needed.
    const well_diam = this.selectedPlate.well_size;
    this.printPositions = this.getPrintPositionCoordinates(8,this.toPX(well_diam), this.toPX(this.printPositionSizeMM));
  }

  toggleButton(button: any) {
    if (!button.active) {
      button.active = true;
      button.backgroundColor = 'red';
    } else {
      button.active = false;
      button.backgroundColor = 'blue';
    }
  }

  getPrintPositionCoordinates(numDots: number, wellSize:number, dotSize:number, adj_x= 0, adj_y= 0) {
    const radius = (0.80 * wellSize) / 2;
    const angles = Array.from({length: numDots}, (_, i) => i / numDots * 2 * Math.PI);

    const x = angles.map(angle => radius * Math.cos(angle));
    const y = angles.map(angle => radius * Math.sin(angle));

    let printPositionCoordinates: Coordinates[] = [];
    for (let i = 0; i < numDots; i++) {
      printPositionCoordinates.push({'x': (x[i] - (dotSize/2) + adj_x), 'y': (y[i] - (dotSize/2) + adj_y), 'label': (i + 1).toString()});
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
