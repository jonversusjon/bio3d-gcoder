import {Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { range } from "rxjs";
import { ScreenUtils } from "../screen-utils";
import { PlateFormatService } from '../plate-format.service';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { PlateFormat} from "../../types/PlateFormat";
import {PrintHead, PrintHeadButton, PrintHeadStateService} from "../printhead-state-service.service";
import { Subscription } from 'rxjs';

interface Well {
  row: number;
  col: number;
  origin: {x: number, y: number};
  selected: boolean;
  style: {
    height: string;
    width: string;
    top: string;
    left: string;
    borderRadius: string;
    border: string;
  };
  element: HTMLElement;
}


@Component({
  selector: 'app-plate-map',
  templateUrl: './plate-map.component.html',
  styleUrls: ['./plate-map.component.css'],
  providers: [ScreenUtils]
})
export class PlateMapComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  @Input() plate!: PlateFormat;
  @Input() selectedPlate!: typeof PlateMapComponent.prototype.plateFormats[0];

  plateFormats: any[] = [];

  containerStyle: any = {
    // Define your style properties here, for example:
    width: '100%',
    height: '100%',
    position: 'relative'
  };

  lastClicked: { row: number, col: number } | null = null;
  lastClickedRow: number | null = null;
  lastClickedCol: number | null = null;

  plateMap: { wells: Well[][]; columnHeaders: any[]; rowHeaders: any[] } = { wells: [], columnHeaders: [], rowHeaders: [] };
  plateHeight = 85.4; // mm
  plateWidth = 127.6; //mm
  plateHeightPX = this.toPX(this.plateHeight);
  plateWidthPX = this.toPX(this.plateWidth);

  selectionRectangleStart: {row: number, col: number} | null = null;
  selectionRectangleVisible = false;

  selectedPrintheadButtonsSubscription!: Subscription;
  selectedPrintheadButtons: PrintHeadButton[][] = [];

  private printHeadsSubscription!: Subscription;
  activePrintHeads: PrintHead[] = [];

  private alphabet_upperCase = [...Array(26)].map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i).toUpperCase());
  constructor(
    private screenUtils: ScreenUtils,
    private plateFormatService: PlateFormatService,
    private printHeadStateService: PrintHeadStateService,
    private renderer: Renderer2,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.plateFormats = plateFormatService.getPlateFormats()
    this.selectedPlate = this.plateFormats[0];
    this.printHeadsSubscription = new Subscription();
  }
  ngAfterViewInit(): void {
    this.updatePlateMap(this.selectedPlate);
    console.log('plate-map-component ngAfterViewInit');
  }
  ngOnInit(): void {
// Subscription for selected position buttons changes
    this.selectedPrintheadButtonsSubscription = this.printHeadStateService.selectedPrintheadButtons$.subscribe(
      (selectedPrintheadButtons: PrintHeadButton[][]) => {
        this.updateExperiment(this.activePrintHeads, selectedPrintheadButtons);
      }
    );

// Subscription for active printheads changes
    this.printHeadsSubscription = this.printHeadStateService.printHeads$.subscribe(printHeads => {
      this.activePrintHeads = printHeads;
      // Call your updateExperiment() method here if needed, with this.printHeads and the latest selectedPrintheadButtons.
    });
  }

  ngOnDestroy(): void {
    this.selectedPrintheadButtonsSubscription.unsubscribe();
    this.printHeadsSubscription.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedPlate'] && changes['selectedPlate'].currentValue) {
      console.log('changes-plate')
      this.plateFormatService.setSelectedPlate(this.selectedPlate);
      this.updatePlateMap(this.selectedPlate);
    } else {
      return;
    }
  }

  onMouseMove(event: MouseEvent, row: number, col: number): void {
    if (event.shiftKey && this.selectionRectangleStart) {
      // Update the ending coordinates of the selection rectangle and make it visible
      this.selectionRectangleVisible = true;
      const endRow = row;
      const endCol = col;

      // Update the selection rectangle's style based on the new ending coordinates
      const style = this.getSelectionRectangleStyle(
        this.selectionRectangleStart.row,
        endRow,
        this.selectionRectangleStart.col,
        endCol
      );

      // Apply the new style to the selection rectangle element
      // ... your logic to update the selection rectangle element's style ...
    } else {
      // Hide the selection rectangle when the shift key is not pressed
      this.selectionRectangleVisible = false;
    }
  }

  getSelectedWells(): Well[] {
    const selectedWells: Well[] = [];

    this.plateMap.wells.forEach(row => {
      row.forEach(well => {
        if (well.selected) {
          selectedWells.push(well);
        }
      });
    });

    return selectedWells;
  }


  updatePlateMap(plate: PlateFormat, event?: MouseEvent) {
    console.log('update plate map')
    const rows = plate.rows;
    const cols = plate.cols;

    const wellDiameterPX = this.toPX(plate.well_size); // pixels
    const wellSpacingPX = this.toPX(plate.well_spacing - plate.well_size) // pixels
    const a1_xPX = this.toPX(plate.a1_center.x) // pixels
    const a1_yPX = this.toPX(plate.a1_center.y) // pixels
    const colHeaderHeightPX = this.toPX(plate.a1_center.y - (plate.well_size/2));
    const rowHeaderWidthPX=this.toPX(plate.a1_center.x - (plate.well_size/2));

    const rowLabels = this.alphabet_upperCase.slice(0, cols);

    this.plateMap.wells = Array.from({ length: rows }, (_, row) => {
      return Array.from({ length: cols }, (_, col) => {
        const wellElement = this.renderer.createElement('div');
        this.renderer.addClass(wellElement, 'plate-cell');
        this.renderer.setAttribute(wellElement, 'data-row', row.toString());
        this.renderer.setAttribute(wellElement, 'data-col', col.toString());

        this.renderer.listen(wellElement, 'click', (event: MouseEvent) => {
          this.toggleWellSelection(row, col, event.shiftKey);
        });

        // Include the returned style in the final well object
        return {
          row,
          col,
          selected: false,
          style: {
            ...this.getCommonStyleHeaders(),
            height: `${wellDiameterPX}px`,
            width: `${wellDiameterPX}px`,
            top: `${(a1_yPX - (wellDiameterPX / 2)) + (row * (wellSpacingPX + wellDiameterPX))}px`,
            left: `${(a1_xPX - (wellDiameterPX / 2)) + (col * (wellSpacingPX + wellDiameterPX))}px`,
            borderRadius: '50%',
            border: '1px solid black'
          },
          element: wellElement,
          origin: {
            x: (a1_xPX - (wellDiameterPX / 2)) + (col * (wellSpacingPX + wellDiameterPX)),
            y: (a1_yPX - (wellDiameterPX / 2)) + (row * (wellSpacingPX + wellDiameterPX))
          }
        } as Well;

      });
    });

    this.plateMap.rowHeaders = Array.from({length: plate.rows}, (_, row) => {
      const rowElement = this.renderer.createElement('div');
      this.renderer.addClass(rowElement, 'row-header');
      this.renderer.setAttribute(rowElement, 'data-row', row.toString());

      this.renderer.listen(rowElement, 'click', () => {
        this.toggleRowSelection(row, event);
      });

      return {
        style: {
          ...this.getCommonStyleHeaders(),
          height:`${wellDiameterPX}px`,
          width:`${rowHeaderWidthPX}px`,
          top: `${(row * (wellDiameterPX + wellSpacingPX)) + (wellDiameterPX/2) + colHeaderHeightPX - 10}px`
        },
        type: 'rowHeader',
        label: rowLabels[row],
        row,
      };
    });

    this.plateMap.columnHeaders = Array.from({length: plate.cols}, (_, col) => {
      return {
        style: {
          ...this.getCommonStyleHeaders(),
          height:`${rowHeaderWidthPX}px`,
          width: `${wellDiameterPX}px`,
          left: `${(col * (wellDiameterPX + wellSpacingPX)) + rowHeaderWidthPX}px`
        },
        type: 'columnHeader',
        label: (col+1).toString(),
        col,
      };
    });

    const blankTile= {
      ...this.getCommonStyleHeaders(),
      backgroundColor: 'blue',
      width:`${rowHeaderWidthPX}px`,
      height:`${colHeaderHeightPX}px`
    }
  }

  updateExperiment(printHeads: PrintHead[], selectedPrintheadButtons: PrintHeadButton[][]): void {
    //Iterate through all the active printheads
    printHeads.forEach((activePrintHead, printheadIndex) => {
      if (activePrintHead.active) {
        // Iterate through the selectedPrintheadButtons
        selectedPrintheadButtons.forEach((printheadButtons, printHeadIndex) => {
          printheadButtons.forEach((button) => {
            // Get the selected wells on the plate map
            const pickerWell_to_plateWell_ratio = this.selectedPlate.wells[0].size / activePrintHead.pickerWell.size;
            const selectedWells = this.getSelectedWells();
            // console.log('updateExperiment, selectedWells: ', JSON.stringify(selectedWells));
            // Draw a circle for each selected print position in every selected well
            selectedWells.forEach((well) => {
              this.drawCircle(well, button, pickerWell_to_plateWell_ratio);
            });
          });
        });
      }
    });
  }

  drawCircle(well: Well, button: PrintHeadButton, ratio: number): void {
    // Implement this method to draw a circle at the position of the button in the well.
    // You need to replace 'Well' with the correct type representing a well in your application.

    // Calculate the relative position of the button in the well using the ratio of the size of the well on the plate map divided by the size of the well on the printhead picker.
    const relativePosition = {
      x: (well.origin.x + button.coordinates.x) * ratio,
      y: (well.origin.y + button.coordinates.y) * ratio
    };

    // Draw a circle at the relativePosition with the size and color of the button.
    // You can use the appropriate method to draw the circle depending on the framework or library you are using to render the plate map.
  }

  get plateStyle() {
    return {
      position: 'absolute',
      border: '1px solid #000',
      height: `${this.plateHeightPX}px`,
      width: `${this.plateWidthPX}px`,
      margin: '2em'
    };
  }

  selectRegion(row: number, col: number, lastRow: number, lastCol: number): void {
    const startRow = Math.min(row, lastRow);
    const endRow = Math.max(row, lastRow);
    const startCol = Math.min(col, lastCol);
    const endCol = Math.max(col, lastCol);

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        this.plateMap.wells[r][c].selected = !this.plateMap.wells[r][c].selected;
      }
    }
  }

// Method to calculate the selection rectangle's style
  getSelectionRectangleStyle(startRow: number, endRow: number, startCol: number, endCol: number): object {
    // Calculate the position and dimensions of the selection rectangle based on the starting and ending coordinates
    const wellDiameterPX = this.toPX(this.plate.well_size);
    const wellSpacingPX = this.toPX(this.plate.a1_center.x - this.plate.well_size / 2);
    const rowHeaderWidthPX = this.toPX(this.plate.a1_center.x - this.plate.well_size / 2);
    const colHeaderHeightPX = this.toPX(this.plate.a1_center.y - this.plate.well_size / 2);

    const startX = startCol * (wellDiameterPX + wellSpacingPX) + rowHeaderWidthPX;
    const startY = startRow * (wellDiameterPX + wellSpacingPX) + colHeaderHeightPX;
    const width = (endCol - startCol + 1) * (wellDiameterPX + wellSpacingPX) - wellSpacingPX;
    const height = (endRow - startRow + 1) * (wellDiameterPX + wellSpacingPX) - wellSpacingPX;

    console.log('getSelectionRectangleStyle: ', JSON.stringify(this.plate))
    return {
      position: 'absolute',
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: 'rgba(0, 0, 255, 0.3)', // semi-transparent blue color
      border: '1px solid blue',
      zIndex: 10
    };
  }

  toggleWellSelection(row: number, col: number, shiftKey: boolean = false): void {
    if (shiftKey && this.lastClicked) {
      this.selectionRectangleStart = {row, col};
      this.selectRegion(row, col, this.lastClicked.row, this.lastClicked.col);
    } else {
      this.plateMap.wells[row][col].selected = !this.plateMap.wells[row][col].selected;
      this.lastClicked = { row, col };
    }
    // Call updateExperiment for the changed well(s)
    this.updateExperiment(this.activePrintHeads, this.printHeadStateService.selectedPrintheadButtons);
  }

  toggleRowSelection(rowIndex: number, event?: MouseEvent): void {

    if(event) {
      const shiftKeyPressed = event.shiftKey;

      if (shiftKeyPressed && this.lastClickedRow !== null) {
        const startRow = Math.min(rowIndex, this.lastClickedRow);
        const endRow = Math.max(rowIndex, this.lastClickedRow);
        const allSelected = this.areAllWellsSelected(startRow, endRow, 0, this.selectedPlate.cols - 1, this.plateMap.wells);

        this.selectionRectangleStart = {row: rowIndex, col: 0};
        for (let i = startRow; i <= endRow; i++) {
          for (let j = 0; j < this.selectedPlate.cols; j++) {
            this.plateMap.wells[i][j].selected = !allSelected;
          }
        }
      } else {
        // Toggle entire row
        const allSelectedInRow = this.areAllWellsSelected(rowIndex, rowIndex, 0, this.selectedPlate.cols - 1, this.plateMap.wells);
        for (let j = 0; j < this.selectedPlate.cols; j++) {
          this.plateMap.wells[rowIndex][j].selected = !allSelectedInRow;
        }
      }
    } else {
      // Toggle entire row
      const allSelectedInRow = this.areAllWellsSelected(rowIndex, rowIndex, 0, this.selectedPlate.cols - 1, this.plateMap.wells);
      for (let j = 0; j < this.selectedPlate.cols; j++) {
        this.plateMap.wells[rowIndex][j].selected = !allSelectedInRow;
      }
    }
    this.lastClickedRow = rowIndex;

  }

  toggleColumnSelection(colIndex: number, event?: MouseEvent): void {

    if(event) {
      const shiftKeyPressed = event.shiftKey;
      if (shiftKeyPressed && this.lastClickedCol !== null) {
        this.selectionRectangleStart = {row: 0, col: colIndex};
        const startCol = Math.min(colIndex, this.lastClickedCol);
        const endCol = Math.max(colIndex, this.lastClickedCol);
        const allSelected = this.areAllWellsSelected(0, this.selectedPlate.rows - 1, startCol, endCol, this.plateMap.wells);

        for (let j = startCol; j <= endCol; j++) {
          for (let i = 0; i < this.selectedPlate.rows; i++) {
            this.plateMap.wells[i][j].selected = !allSelected;
          }
        }
      } else {
        // Toggle entire column
        const allSelectedInCol = this.areAllWellsSelected(0, this.selectedPlate.rows - 1, colIndex, colIndex, this.plateMap.wells);
        for (let i = 0; i < this.selectedPlate.rows; i++) {
          this.plateMap.wells[i][colIndex].selected = !allSelectedInCol;
        }
      }
    } else {
      // Toggle entire column
      const allSelectedInCol = this.areAllWellsSelected(0, this.selectedPlate.rows - 1, colIndex, colIndex, this.plateMap.wells);
      for (let i = 0; i < this.selectedPlate.rows; i++) {
        this.plateMap.wells[i][colIndex].selected = !allSelectedInCol;
      }
    }
    this.lastClickedCol = colIndex;

  }

  areAllWellsSelected(startRow: number, endRow: number, startCol: number, endCol: number, wells: any[][]): boolean {
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        if (!wells[i][j].selected) {
          return false;
        }
      }
    }
    return true;
  }

  toPX(size_in_mm: number) {
    return this.screenUtils.convertMMToPPI(size_in_mm);
  }

  getCommonStyleHeaders() {
    return {
      display: 'block',
      position: 'absolute',
      border: 'none',
      textAlign: 'center',
      margin: 'auto',
      fontSize: '20px',
      fontWeight: 'bold'
    }
  };

  protected readonly range = range;
  protected readonly length = length;
  protected readonly Math = Math;
}
