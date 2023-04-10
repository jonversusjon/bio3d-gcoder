import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { range } from "rxjs";
import { ScreenUtils } from "../screen-utils";
import { Coordinates } from "../../types/Coordinates";

@Component({
  selector: 'app-plate-map',
  templateUrl: './plate-map.component.html',
  styleUrls: ['./plate-map.component.css'],
  providers: [ScreenUtils]
})
export class PlateMapComponent implements OnChanges {
  @Input() plate!: { plateId: number, name: string; rows: number; cols: number; well_size: number, well_spacing: number; a1_center: Coordinates  };
  lastClicked: { row: number, col: number } | null = null;
  lastClickedRow: number | null = null;
  lastClickedCol: number | null = null;

  plateMap: { wells: any[][]; columnHeaders: any[]; rowHeaders: any[] } = { wells: [], columnHeaders: [], rowHeaders: [] };
  plateHeight = 85.4; // mm
  plateWidth = 127.6; //mm
  plateHeightPX = this.toPX(this.plateHeight);
  plateWidthPX = this.toPX(this.plateWidth);

  private alphabet_upperCase = [...Array(26)].map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i).toUpperCase());
  constructor(private screenUtils: ScreenUtils) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes["plate"]) {
      this.updatePlateMap();
    } else {
      return;
    }
  }

  ngAfterViewInit() {
    const wells = document.getElementsByClassName('plate-cell');
    for (let i = 0; i < wells.length; i++) {
      const well = wells[i];

      well.addEventListener('click', () => {
        const row = Number(well.getAttribute('data-row'));
        const col = Number(well.getAttribute('data-col'));
        this.toggleWellSelection(row, col);
      });
    }
  }

  updatePlateMap() {
    const rows = this.plate.rows;
    const cols = this.plate.cols;

    const wellDiameterPX = this.toPX(this.plate.well_size); // pixels
    const wellSpacingPX = this.toPX(this.plate.well_spacing - this.plate.well_size) // pixels
    const a1_xPX = this.toPX(this.plate.a1_center.x) // pixels
    const a1_yPX = this.toPX(this.plate.a1_center.y) // pixels
    const colHeaderHeightPX = this.toPX(this.plate.a1_center.y - (this.plate.well_size/2));
    const rowHeaderWidthPX=this.toPX(this.plate.a1_center.x - (this.plate.well_size/2));

    const rowLabels = this.alphabet_upperCase.slice(0, cols);

    this.plateMap.wells = Array.from({ length: rows }, (_, row) => {
      return Array.from({ length: cols }, (_, col) => {
        return {
          row,
          col,
          selected: false,
          style: {
            ...this.getCommonStyleHeaders(),
            height:`${wellDiameterPX}px`,
            width:`${wellDiameterPX}px`,
            top: `${(a1_yPX - (wellDiameterPX / 2)) + (row * (wellSpacingPX + wellDiameterPX))}px`,
            left: `${(a1_xPX - (wellDiameterPX / 2)) + (col * (wellSpacingPX + wellDiameterPX))}px`,
            borderRadius: '50%',
            border: '1px solid black'
          },
        }; // Include the returned style in the final well object
      });
    });

    this.plateMap.rowHeaders = Array.from({length: this.plate.rows}, (_, row) => {
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


    this.plateMap.columnHeaders = Array.from({length: this.plate.cols}, (_, col) => {
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

  get containerStyle() {
    return {

    }
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

  toggleWellSelection(row: number, col: number, shiftKey: boolean = false): void {
    if (shiftKey && this.lastClicked) {
      this.selectRegion(row, col, this.lastClicked.row, this.lastClicked.col);
    } else {
      this.plateMap.wells[row][col].selected = !this.plateMap.wells[row][col].selected;
      this.lastClicked = { row, col };
    }
  }

  toggleRowSelection(rowIndex: number, event: MouseEvent): void {
    const shiftKeyPressed = event.shiftKey;

    if (shiftKeyPressed && this.lastClickedRow !== null) {
      const startRow = Math.min(rowIndex, this.lastClickedRow);
      const endRow = Math.max(rowIndex, this.lastClickedRow);
      const allSelected = this.areAllWellsSelected(startRow, endRow, 0, this.plate.cols - 1, this.plateMap.wells);

      for (let i = startRow; i <= endRow; i++) {
        for (let j = 0; j < this.plate.cols; j++) {
          this.plateMap.wells[i][j].selected = !allSelected;
        }
      }
    } else {
      // Toggle entire row
      const allSelectedInRow = this.areAllWellsSelected(rowIndex, rowIndex, 0, this.plate.cols - 1, this.plateMap.wells);
      for (let j = 0; j < this.plate.cols; j++) {
        this.plateMap.wells[rowIndex][j].selected = !allSelectedInRow;
      }
    }

    this.lastClickedRow = rowIndex;
  }


  toggleColumnSelection(colIndex: number, event: MouseEvent): void {
    const shiftKeyPressed = event.shiftKey;

    if (shiftKeyPressed && this.lastClickedCol !== null) {
      const startCol = Math.min(colIndex, this.lastClickedCol);
      const endCol = Math.max(colIndex, this.lastClickedCol);
      const allSelected = this.areAllWellsSelected(0, this.plate.rows - 1, startCol, endCol, this.plateMap.wells);

      for (let j = startCol; j <= endCol; j++) {
        for (let i = 0; i < this.plate.rows; i++) {
          this.plateMap.wells[i][j].selected = !allSelected;
        }
      }
    } else {
      // Toggle entire column
      const allSelectedInCol = this.areAllWellsSelected(0, this.plate.rows - 1, colIndex, colIndex, this.plateMap.wells);
      for (let i = 0; i < this.plate.rows; i++) {
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
