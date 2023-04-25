
import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import { PlateFormat } from "../../types/PlateFormat";
import { Well} from "../../types/Well";
import { ScreenUtils } from "./screen-utils";
import { UtilsService } from "./utils.service";
import { PlateFormatService } from "./plate-format.service";
import { PrintHeadStateService } from "./print-head-state.service";
import { StyleService } from "./style.service";
import { PlateMap } from "../../types/PlateMap";
import { RectangleSelectionService } from "./rectangle-selection.service";
import {BehaviorSubject} from "rxjs";
import { PrintPositionService } from "./print-position.service";

@Injectable({
  providedIn: 'root'
})
export class WellsStateService {
  private renderer: Renderer2;
  private currentPlateMap: PlateMap | null = null;

  lastClicked: { row: number, col: number } | null = null;
  lastClickedRow: number | null = null;
  lastClickedCol: number | null = null;

  wellSelectionStates: boolean[] = [];
  private _wells = new BehaviorSubject<Well[][]>([]);
  public wells$ = this._wells.asObservable();
  constructor(private utilsService: UtilsService,
              private screenUtils: ScreenUtils,
              private plateFormatService: PlateFormatService,
              private printHeadStateService: PrintHeadStateService,
              private styleService: StyleService,
              private rendererFactory: RendererFactory2,
              private rectangleSelectionService: RectangleSelectionService,
              private printPositionService: PrintPositionService,
              )
  {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.printHeadStateService.printHeads$.subscribe((printHeads) => {
      if(this.currentPlateMap) {
        this._wells.next(this.currentPlateMap.wells);
      }
    });
  }

  updatePlateMap(selectedPlate: PlateFormat, plateMap: PlateMap, event?: MouseEvent) {

    const rows = selectedPlate.rows;
    const cols = selectedPlate.cols;

    const wellDiameterPX = this.toPX(selectedPlate.well_sizeMM); // pixels
    const wellSpacingPX = this.toPX(selectedPlate.well_spacing_x_MM - selectedPlate.well_sizeMM) // pixels
    const a1_xPX = this.toPX(selectedPlate.a1_centerMM.x) // pixels
    const a1_yPX = this.toPX(selectedPlate.a1_centerMM.y) // pixels
    const colHeaderHeightPX = this.toPX(selectedPlate.a1_centerMM.y - (selectedPlate.well_sizeMM/2));
    const rowHeaderWidthPX=this.toPX(selectedPlate.a1_centerMM.x - (selectedPlate.well_sizeMM/2));

    const rowLabels = this.utilsService.alphabet_upperCase.slice(0, cols);
    const wellOriginsMM = this.plateFormatService.getWellOrigins(
      selectedPlate.a1_centerMM.x,
      selectedPlate.a1_centerMM.y,
      rows,
      cols,
      selectedPlate.well_spacing_x_MM,
      selectedPlate.well_spacing_y_MM);

      plateMap.wells = Array.from({length: rows}, (_, row) => {
        return Array.from({length: cols}, (_, col) => {
          const wellElement = this.renderer.createElement('div');
          this.renderer.addClass(wellElement, 'plate-well');
          this.renderer.setAttribute(wellElement, 'data-row', row.toString());
          this.renderer.setAttribute(wellElement, 'data-col', col.toString());

          this.renderer.listen(wellElement, 'click', (event: MouseEvent) => {
            this.toggleWellSelection(plateMap, row, col, event.shiftKey);
          });

          const origin_xMM = wellOriginsMM[row][col].x;
          const origin_yMM = wellOriginsMM[row][col].y;

          // Include the returned style in the final well object
          return {
            row: row,
            col: col,
            selected: false,
            printPositionButtons: Array.from({ length: this.printHeadStateService.PRINT_POSITIONS_COUNT }, (_, index) => ({
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
              ...this.styleService.getBaseStyle('plate-headers'),
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
      const wellCount = rows * cols
      this.wellSelectionStates = new Array(wellCount).fill(false);

      plateMap.rowHeaders = Array.from({length: rows}, (_, row) => {
        const rowElement = this.renderer.createElement('div');
        this.renderer.addClass(rowElement, 'row-header');
        this.renderer.setAttribute(rowElement, 'data-row', row.toString());

        this.renderer.listen(rowElement, 'click', () => {
          this.toggleRowSelection(selectedPlate, plateMap, row, event);
        });

        return {
          style: {
            ...this.styleService.getBaseStyle('plate-headers'),
            height: `${wellDiameterPX}px`,
            width: `${rowHeaderWidthPX}px`,
            top: `${(row * (wellDiameterPX + wellSpacingPX)) + (wellDiameterPX / 2) + colHeaderHeightPX - 10}px`
          },
          type: 'rowHeader',
          label: rowLabels[row],
          row,
        };
      });

      plateMap.columnHeaders = Array.from({length: cols}, (_, col) => {
        return {
          style: {
            ...this.styleService.getBaseStyle('plate-headers'),
            height: `${rowHeaderWidthPX}px`,
            width: `${wellDiameterPX}px`,
            left: `${(col * (wellDiameterPX + wellSpacingPX)) + rowHeaderWidthPX}px`
          },
          type: 'columnHeader',
          label: (col + 1).toString(),
          col,
        };
      });
    this.currentPlateMap = plateMap;
    this._wells.next(plateMap.wells);

  }
  toggleWellSelection(plateMap: PlateMap, row: number, col: number, shiftKey: boolean = false): void {
    ;
    if (shiftKey && this.lastClicked) {
      this.rectangleSelectionService.selectionRectangleStart = {row, col};
      this.selectRegion(plateMap, row, col, this.lastClicked.row, this.lastClicked.col);
    } else {
      plateMap.wells[row][col].selected = !plateMap.wells[row][col].selected;
      const wellIndex = row * plateMap.columnHeaders.length + col;
      this.wellSelectionStates[wellIndex] = plateMap.wells[row][col].selected;
      this.lastClicked = { row, col };
    }
    this.currentPlateMap = plateMap
    this._wells.next(plateMap.wells);
  }
  toggleRowSelection(selectedPlate: PlateFormat, plateMap: PlateMap, rowIndex: number, event?: MouseEvent): void {

    if(event) {
      const shiftKeyPressed = event.shiftKey;

      if (shiftKeyPressed && this.lastClickedRow !== null) {
        const startRow = Math.min(rowIndex, this.lastClickedRow);
        const endRow = Math.max(rowIndex, this.lastClickedRow);
        const allSelected = this.areAllWellsSelected(startRow, endRow, 0, selectedPlate.cols - 1, plateMap.wells);

        this.rectangleSelectionService.selectionRectangleStart = {row: rowIndex, col: 0};
        for (let i = startRow; i <= endRow; i++) {
          for (let j = 0; j < selectedPlate.cols; j++) {
            plateMap.wells[i][j].selected = !allSelected;
          }
        }
      } else {
        // Toggle entire row
        const allSelectedInRow = this.areAllWellsSelected(rowIndex, rowIndex, 0, selectedPlate.cols - 1, plateMap.wells);
        for (let j = 0; j < selectedPlate.cols; j++) {
          plateMap.wells[rowIndex][j].selected = !allSelectedInRow;
        }
      }
    } else {
      // Toggle entire row
      const allSelectedInRow = this.areAllWellsSelected(rowIndex, rowIndex, 0, selectedPlate.cols - 1, plateMap.wells);
      for (let j = 0; j < selectedPlate.cols; j++) {
        plateMap.wells[rowIndex][j].selected = !allSelectedInRow;
      }
    }
    this.currentPlateMap = plateMap;
    this.lastClickedRow = rowIndex;
  }

  toggleColumnSelection(selectedPlate: PlateFormat, plateMap: PlateMap, colIndex: number, event?: MouseEvent): void {

    if(event) {
      const shiftKeyPressed = event.shiftKey;
      if (shiftKeyPressed && this.lastClickedCol !== null) {
        this.rectangleSelectionService.selectionRectangleStart = {row: 0, col: colIndex};
        const startCol = Math.min(colIndex, this.lastClickedCol);
        const endCol = Math.max(colIndex, this.lastClickedCol);
        const allSelected = this.areAllWellsSelected(0, selectedPlate.rows - 1, startCol, endCol, plateMap.wells);

        for (let j = startCol; j <= endCol; j++) {
          for (let i = 0; i < selectedPlate.rows; i++) {
            plateMap.wells[i][j].selected = !allSelected;
          }
        }
      } else {
        // Toggle entire column
        const allSelectedInCol = this.areAllWellsSelected(0, selectedPlate.rows - 1, colIndex, colIndex, plateMap.wells);
        for (let i = 0; i < selectedPlate.rows; i++) {
          plateMap.wells[i][colIndex].selected = !allSelectedInCol;
        }
      }
    } else {
      // Toggle entire column
      const allSelectedInCol = this.areAllWellsSelected(0, selectedPlate.rows - 1, colIndex, colIndex, plateMap.wells);
      for (let i = 0; i < selectedPlate.rows; i++) {
        plateMap.wells[i][colIndex].selected = !allSelectedInCol;
      }
    }
    this.lastClickedCol = colIndex;
    this.currentPlateMap = plateMap;
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

  selectRegion(plateMap: PlateMap, row: number, col: number, lastRow: number, lastCol: number): void {
    const startRow = Math.min(row, lastRow);
    const endRow = Math.max(row, lastRow);
    const startCol = Math.min(col, lastCol);
    const endCol = Math.max(col, lastCol);

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        plateMap.wells[r][c].selected = !plateMap.wells[r][c].selected;
      }
    }
  }
  toPX(size_in_mm: number) {
    return this.screenUtils.convertMMToPX(size_in_mm);
  }
}
