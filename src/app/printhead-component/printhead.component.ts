import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { PlateFormat } from "../../types/PlateFormat";
import { ScreenUtils } from "../screen-utils";
import { PrintPositionService } from "../print-position.service"
import { PrintHead } from "../../types/PrintHead";
import { PrintHeadButton } from "../../types/PrintHeadButton";
import {Observable, Subscription} from "rxjs";
import {Well} from "../../types/Well";
import {Coordinates} from "../../types/Coordinates";
import {Needle} from "../../types/Needle";

@Component({
  selector: 'app-printhead-component',
  templateUrl: './printhead.component.html',
  styleUrls: ['./printhead.component.css']
})
export class PrintheadComponent implements OnInit, OnDestroy {
  @Input() printHeadChanged!: PrintHead;
  private plateFormatChangedSubscription: Subscription = new Subscription();
  private selectedPlate!: PlateFormat;
  printPositionCoordinates$!: Observable<Coordinates[]>;
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

  needles:Needle[] = []

  constructor(
    private screenUtils: ScreenUtils,
    private printPositionService: PrintPositionService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.printPositionCoordinates$ = printPositionService.printPositionCoordinates$;
    this.plateFormatChangedSubscription = this.printPositionService.selectedPlate$.subscribe(plate => {
      if (plate) {
        this.selectedPlate = plate;
        this.updatePrintHeads();
      }
    });
    this.needles = this.printPositionService.needles;
  }

  ngOnInit() {
    this.updatePrintHeads();
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    // this.printHeadChangedSubscription.unsubscribe();
    this.plateFormatChangedSubscription.unsubscribe();
  }

  updatePrintHeads() {
    const newPrintHead: PrintHead = {
      printHeadIndex: this.printHeads.length,
      description: '',
      color: this.getNextColor(),
      active: true,
      printPositionButtons: Array.from({ length: this.printPositionService.PRINT_POSITIONS_COUNT }, (_, index) => ({
        printHead: this.printHeads.length,
        position: index,
        color: this.getNextColor(),
        selected: false,
        originPX: { x: 0, y: 0 },
        originMM: { x: 0, y: 0 },
        style: {}
      })),
      needle: this.needles[0],
      printPositionSizeMM: this.needles[0].odMM,
      buttonWidthMM: 0,
      pickerWell: { sizeMM: this.printPickerSizeMM },
      elementType: 'PrintHead'
    };

    if (this.numberOfPrintHeads > this.printHeads.length) {
      for (let i = this.printHeads.length; i < this.numberOfPrintHeads; i++) {
        this.printHeads.push({ ...newPrintHead });
      }
    } else {
      this.printHeads = this.printHeads.slice(0, this.numberOfPrintHeads);
    }

    this.printHeads.forEach((printHead) => {
      this.updatePrintHeadButtons(printHead, undefined, true);
    });

    this.printPositionService.updatePrintHeads(this.printHeads);

  }

  getButtonWidthPX(printhead: PrintHead) {
    const buttonWidthMM = this.printPositionService.getButtonWidthMM(printhead);
    printhead.buttonWidthMM = buttonWidthMM;
    return this.toPX(buttonWidthMM);
  }
  getButtonLeftPX(printHead: PrintHead, printHeadButtonPosition: number) {
    return this.toPX(this.printPositionService.getButtonLeftMM(printHead, printHeadButtonPosition));
  }

  getButtonTopPX(printHead: PrintHead, printHeadButtonPosition: number) {
    return this.toPX(this.printPositionService.getButtonTopMM(printHead, printHeadButtonPosition));
  }

  isButtonSmall(printhead: PrintHead): boolean {
    const buttonWidth = this.printPositionService.getButtonWidthMM(printhead);
    return this.toPX(buttonWidth) < 6;
  }

  isSelectedButton(printHeadButton: PrintHeadButton): boolean {
    return printHeadButton.selected;
    // Implement your logic to check if the button is selected
    // For example, you can check if the printHeadButton is in the selectedPrintHeadButtons array
  }
  // getPrintPositionPickerStyle(isActive: boolean): object {
  //   if(this.selectedPlate) {
  //
  //     const commonStyle = {
  //       width: `${this.toPX(this.printPickerSizeMM)}px`,
  //       aspectRatio: '1 / 1',
  //       marginLeft: 'auto',
  //       marginRight: 'auto'
  //     }
  //     if(isActive) {
  //       return {...commonStyle}
  //     } else {
  //       return {
  //         ...commonStyle,
  //         backgroundColor: '#f8f8f8'
  //       }
  //     }
  //   }else {
  //     return {}
  //   }
  // }

  private getNextColor(): string {
    const currentColorIndex = this.printHeads.length % this.colors.length;
    return this.colors[currentColorIndex];
  }

  updatePrintHeadButtons(printHead: PrintHead, buttonIndex?: number, updateAll: boolean = false) {
    if (updateAll) {
      this.updateAllPrintHeadButtons(printHead);
    } else if (buttonIndex !== undefined) {
      this.toggleButton(printHead, printHead.printPositionButtons[buttonIndex]);
    }
    this.updatePrintHeadStateService(printHead);
  }

  updateAllPrintHeadButtons(printHead: PrintHead) {
    if (!printHead.active) {
      this.setAllButtonsInactive(printHead);
    } else {
      // if (this.selectedPlate) { // Add this check
        // this.printPositionService.repopulatePrintPositionButtons(this.selectedPlate.well_sizeMM, printHead, undefined);
      // }
    }
  }

  setAllButtonsInactive(PrintHead: PrintHead) {
    PrintHead.printPositionButtons.map(button => {
      return {...button, selected: false};
    });
  }

  // toggleButtonElectedState(PrintHead: PrintHead, buttonIndex: number) {
  //   PrintHead.printPositionButtons[buttonIndex].selected = !PrintHead.printPositionButtons[buttonIndex].selected
  // }

  toggleButton(printHead: PrintHead, printHeadButton: PrintHeadButton) {
    printHeadButton.selected = !printHeadButton.selected;
    this.printPositionService.togglePrintHeadButton(printHead, printHeadButton.position, printHeadButton.selected);
  }


  updatePrintHeadStateService(printHead: PrintHead) {
    const selectedButtons = printHead.printPositionButtons.filter((button: PrintHeadButton, index: number) => {
      return printHead.printPositionButtons[index].selected == true;
    }).map((button: any) => ({ ...button, color: printHead.color }));

    //this.printPositionService.updateSelectedPrintHeadButtons(printHead, selectedButtons);
  }
  updatePrintHeadNeedle(printHead: PrintHead, needle: Needle) {
    this.printPositionService.updatePrintHeadNeedle(printHead, needle);
  }

  toPX(size_in_mm:number) {
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  getPrintPickerWidthPX() {
    return this.toPX(this.printPickerSizeMM);
  }
  // updateNeedleOD(printhead: PrintHead, printheadIndex: number): void {
  //   this.printPositionService.updatePrintPositionBaseSize(printhead.needle);
  // }
}

