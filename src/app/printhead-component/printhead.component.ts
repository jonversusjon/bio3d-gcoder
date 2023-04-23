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
import {StyleService} from "../style.service";

@Component({
  selector: 'app-printhead-component',
  templateUrl: './printhead.component.html',
  styleUrls: ['./printhead.component.css']
})
export class PrintheadComponent implements OnInit, OnDestroy {
  @Input() printHeadChanged!: PrintHead;

  public customButtonToggleStyle: any;

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
  scale:number = 2; //factor to scale elements by if the smallest element falls below 6px
  constructor(
    private screenUtils: ScreenUtils,
    private printPositionService: PrintPositionService,
    private cd: ChangeDetectorRef,
    private styleService: StyleService) {
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
    this.cd.detectChanges();
    this.customButtonToggleStyle = this.styleService.getBaseStyle('custom-button-toggle');
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
    const scalar = this.getScalar(this.printPositionService.getButtonWidthMM(printhead))
    const buttonWidthMM = this.printPositionService.getButtonWidthMM(printhead)*scalar;
    printhead.buttonWidthMM = buttonWidthMM;
    return this.toPX(buttonWidthMM);
  }
  getButtonLeftPX(printHead: PrintHead, printHeadButtonPosition: number) {
    const scalar = this.getScalar(this.printPositionService.getButtonWidthMM(printHead))
    return this.toPX(this.printPositionService.getButtonLeftMM(printHead, printHeadButtonPosition)*scalar);
  }

  getButtonTopPX(printHead: PrintHead, printHeadButtonPosition: number) {
    const scalar = this.getScalar(this.printPositionService.getButtonWidthMM(printHead))
    return this.toPX(this.printPositionService.getButtonTopMM(printHead, printHeadButtonPosition)*scalar);
  }

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

  setAllButtonsInactive(printHead: PrintHead) {
    printHead.printPositionButtons.forEach(button => {
      button.selected = false;
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
      return printHead.printPositionButtons[index].selected;
    }).map((button: any) => ({ ...button, color: printHead.color }));

    //this.printPositionService.updateSelectedPrintHeadButtons(printHead, selectedButtons);
  }
  updatePrintHeadNeedle(printHead: PrintHead, needle: Needle) {
    this.printPositionService.updatePrintHeadNeedle(printHead, needle);
    this.cd.markForCheck();
  }

  getScalar(size_in_mm: number) {
    return 1;
  }
  toPX(size_in_mm:number, scale=1) {
    if(scale && scale != 1) {
      size_in_mm = size_in_mm * scale;
    }
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  getPrintPickerWidthPX(printHead: PrintHead) {
    const scalar = this.getScalar(this.printPositionService.getButtonWidthMM(printHead))
    return (this.toPX(this.printPickerSizeMM)*scalar);
  }
  // updateNeedleOD(printhead: PrintHead, printheadIndex: number): void {
  //   this.printPositionService.updatePrintPositionBaseSize(printhead.needle);
  // }

  getMergedStyles(printHead: PrintHead, button: PrintHeadButton) {
    const mergedStyle =
     {
      ...this.customButtonToggleStyle,
      'width': (this.getButtonWidthPX(printHead)) + 'px',
      'top': (this.getButtonTopPX(printHead, button.position)) + 'px',
      'left': (this.getButtonLeftPX(printHead, button.position)) + 'px',
       'background-color': button.selected ? printHead.color : 'white'
    };
    return mergedStyle;
  }

  getPrintPositionPickerStyle(printHead: PrintHead) {
    const mergedStyle =
      {
        ...this.customButtonToggleStyle,
        'width': (this.getPrintPickerWidthPX(printHead)) + 'px',
        'bottom-margin': '8px'
      }
    return mergedStyle;
  }

}

