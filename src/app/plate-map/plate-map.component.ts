// TODO: make a legend showing color, order and description of print steps
// TODO: some kind of calibration input
// TODO: calculate print moves
// TODO: create input for printing depth (other controllable parameters?)
// TODO: the radius of print positions needs to update to match well_size

import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  RendererFactory2,
  SimpleChanges
} from '@angular/core';
import {Subscription} from "rxjs";
import {FormsModule} from "@angular/forms";
import {ScreenUtils} from "../screen-utils";
import {PlateFormatService} from '../plate-format.service';
import { Well } from "../../types/Well";
import { PlateFormat } from "../../types/PlateFormat";
import { PrintPositionService } from "../print-position.service";
import { PrintHead } from "../../types/PrintHead";
import { PrintHeadButton } from "../../types/PrintHeadButton";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-plate-map',
  templateUrl: './plate-map.component.html',
  styleUrls: ['./plate-map.component.css'],
  providers: [ScreenUtils]
})
export class PlateMapComponent implements OnInit, OnDestroy {

  plateFormats: any[] = [];
  selectedPlate!: PlateFormat;
  prevSelectedPlate!: PlateFormat;
  wellSelectionStates: boolean[] = [];

  containerStyle: any = {
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
  private printHeadsSubscription!: Subscription;
  activePrintHeads: PrintHead[] = [];

  private alphabet_upperCase = [...Array(26)].map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i).toUpperCase());
  constructor(
    private formsModule: FormsModule,
    private screenUtils: ScreenUtils,
    private plateFormatService: PlateFormatService,
    private printPositionService: PrintPositionService,
    private renderer: Renderer2,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.plateFormats = plateFormatService.getPlateFormats()
    this.selectedPlate = this.plateFormats[0];
    this.prevSelectedPlate = this.selectedPlate;
    this.initializeSelectedPlate();
    this.updatePlateMap(this.selectedPlate);
    this.printHeadsSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.selectedPrintheadButtonsSubscription = this.printPositionService.selectedPrintHeadButtons$.subscribe(
      (selectedPrintheadButtons: PrintHeadButton[][]) => {
        console.log('Called from selectedPrintheadButtonsSubscription');
        // this.updateExperiment(this.activePrintHeads, selectedPrintheadButtons);
      }
    );

    this.printHeadsSubscription = this.printPositionService.printHeads$.subscribe(printHeads => {
      console.log('Called from printHeadsSubscription');
      this.activePrintHeads = printHeads;
      // Call your updateExperiment() method here if needed, with this.printHeads and the latest selectedPrintheadButtons.
    });
  }

  initializeSelectedPlate() {
    // Place the logic you want to run when the selectedPlate changes here
    this.updatePlateMap(this.selectedPlate);
    // this.plateFormatChanged.emit(this.selectedPlate);
    this.printPositionService.setSelectedPlate(this.selectedPlate);
  }

  onSelectedPlateChanged(event: MatSelectChange): void {
    const newSelectedPlate = event.value;

    if (newSelectedPlate !== this.prevSelectedPlate) {
      this.updatePlateMap(newSelectedPlate);
      this.prevSelectedPlate = newSelectedPlate;
      this.selectedPlate = newSelectedPlate;
      console.log('newSelectedPlate: ', newSelectedPlate);
      this.printPositionService.setSelectedPlate(newSelectedPlate);
    }
  }

  ngOnDestroy(): void {
    this.selectedPrintheadButtonsSubscription.unsubscribe();
    this.printHeadsSubscription.unsubscribe();
  }

  updatePlateMap(plate: PlateFormat, event?: MouseEvent) {
    const rows = plate.rows;
    const cols = plate.cols;

    const wellDiameterPX = this.toPX(plate.well_sizeMM); // pixels
    const wellSpacingPX = this.toPX(plate.well_spacing_x_MM - plate.well_sizeMM) // pixels
    const a1_xPX = this.toPX(plate.a1_centerMM.x) // pixels
    const a1_yPX = this.toPX(plate.a1_centerMM.y) // pixels
    const colHeaderHeightPX = this.toPX(plate.a1_centerMM.y - (plate.well_sizeMM/2));
    const rowHeaderWidthPX=this.toPX(plate.a1_centerMM.x - (plate.well_sizeMM/2));

    const rowLabels = this.alphabet_upperCase.slice(0, cols);
    const wellOriginsMM = this.plateFormatService.getWellOrigins(plate.a1_centerMM.x, plate.a1_centerMM.y, rows, cols, plate.well_spacing_x_MM, plate.well_spacing_y_MM);

    if (this.selectedPlate) {
      this.plateMap.wells = Array.from({length: rows}, (_, row) => {
        return Array.from({length: cols}, (_, col) => {
          const wellElement = this.renderer.createElement('div');
          this.renderer.addClass(wellElement, 'plate-well');
          this.renderer.setAttribute(wellElement, 'data-row', row.toString());
          this.renderer.setAttribute(wellElement, 'data-col', col.toString());

          this.renderer.listen(wellElement, 'click', (event: MouseEvent) => {
            this.toggleWellSelection(row, col, event.shiftKey);
          });

          const origin_xMM = wellOriginsMM[row][col].x;
          const origin_yMM = wellOriginsMM[row][col].y;

          // Include the returned style in the final well object
          return {
            row: row,
            col: col,
            selected: false,
            printPositionButtons: Array.from({ length: this.printPositionService.PRINT_POSITIONS_COUNT }, (_, index) => ({
              printHead: -1,
              position: index,
              color: 'this.getNextColor()',
              selected: false,
              originPX: { x: 0, y: 0 },
              originMM: { x: 0, y: 0 },
              style: {},
              elementType: 'PrintHeadButton'
            })),
            style: {
              ...this.getCommonStyleHeaders(),
              height: `${wellDiameterPX}px`,
              width: `${wellDiameterPX}px`,
              top: `${(a1_yPX - (wellDiameterPX / 2)) + (row * (wellSpacingPX + wellDiameterPX))}px`,
              left: `${(a1_xPX - (wellDiameterPX / 2)) + (col * (wellSpacingPX + wellDiameterPX))}px`,
              borderRadius: '50%',
              border: '1px solid black',
              backgroundColor: '#fefefe'
            },
            element: wellElement,
            originMM: {x: origin_xMM, y:origin_yMM},
            originPX: {
              x: (a1_xPX - (wellDiameterPX / 2)) + (col * (wellSpacingPX + wellDiameterPX)),
              y: (a1_yPX - (wellDiameterPX / 2)) + (row * (wellSpacingPX + wellDiameterPX))
            },
            elementType: 'Well'
          } as Well;

        });
      });
      //initialize or reset the wellSelectionStates Array
      const wellCount = this.selectedPlate.rows * this.selectedPlate.cols
      this.wellSelectionStates = new Array(wellCount).fill(false);

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
            height: `${wellDiameterPX}px`,
            width: `${rowHeaderWidthPX}px`,
            top: `${(row * (wellDiameterPX + wellSpacingPX)) + (wellDiameterPX / 2) + colHeaderHeightPX - 10}px`
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
            height: `${rowHeaderWidthPX}px`,
            width: `${wellDiameterPX}px`,
            left: `${(col * (wellDiameterPX + wellSpacingPX)) + rowHeaderWidthPX}px`
          },
          type: 'columnHeader',
          label: (col + 1).toString(),
          col,
        };
      });
    }

  }

  get plateStyle() {
    return {
      position: 'absolute',
      border: '1px solid #000',
      height: `${this.plateHeightPX}px`,
      width: `${this.plateWidthPX}px`,
      marginTop: '1em',
      backgroundColor: '#efefef',
      borderRadius: '12px'
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



  toggleWellSelection(row: number, col: number, shiftKey: boolean = false): void {
    if (shiftKey && this.lastClicked) {
      this.selectionRectangleStart = {row, col};
      this.selectRegion(row, col, this.lastClicked.row, this.lastClicked.col);
    } else {
      this.plateMap.wells[row][col].selected = !this.plateMap.wells[row][col].selected;
      const wellIndex = row * this.plateMap.columnHeaders.length + col;
      this.wellSelectionStates[wellIndex] = this.plateMap.wells[row][col].selected;
      this.lastClicked = { row, col };
    }
    // Call updateExperiment for the changed well(s)
    // this.updateExperiment(this.activePrintHeads, this.printHeadStateService.selectedPrintHeadButtons);
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
  onMouseMove(event: MouseEvent, row: number, col: number): void {
    if (event.shiftKey && this.selectionRectangleStart) {
      // Update the ending coordinates of the selection rectangle and make it visible
      this.selectionRectangleVisible = true;
      const endRow = row;
      const endCol = col;

    } else {
      // Hide the selection rectangle when the shift key is not pressed
      this.selectionRectangleVisible = false;
    }
  }
  toPX(size_in_mm: number) {
    return this.screenUtils.convertMMToPX(size_in_mm);
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

}
