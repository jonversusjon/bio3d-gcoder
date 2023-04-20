import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { PlateFormat } from "../../types/PlateFormat";
import { ScreenUtils } from "../screen-utils";
import { PrintPositionService } from "../print-position.service"
import { PrintHead } from "../../types/PrintHead";
import { PrintHeadButton } from "../../types/PrintHeadButton";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-printhead-component',
  templateUrl: './printhead.component.html',
  styleUrls: ['./printhead.component.css']
})
export class PrintheadComponent implements OnInit, OnDestroy, OnChanges {
  @Input() printHeadChanged!: PrintHead;
  @Input() selectedPlate!: PlateFormat;

  private printHeadChangedSubscription: Subscription = new Subscription();
  private plateFormatChangedSubscription: Subscription = new Subscription();

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

  constructor(
    private screenUtils: ScreenUtils,
    private printPositionService: PrintPositionService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.updatePrintHeads();
    this.changeDetectorRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes["plateFormat"]) { // Change this line
      this.selectedPlate = changes["plateFormat"].currentValue; // Change this line
      this.updatePrintHeads();
      this.changeDetectorRef.detectChanges();
    }
  }
  ngOnDestroy() {
    this.printHeadChangedSubscription.unsubscribe();
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
  _getPrintPositionButtonStyle(printHead: PrintHead, printPosition: number) {

    if (this.selectedPlate) {
      const pickerWell_to_plateWell_ratio = this.selectedPlate.well_sizeMM / this.printPickerSizeMM;
      const radius = this.toPX(this.printPickerSizeMM) / 2;
      const buttonSize = this.toPX(this.printPickerSizeMM / 4);

      // Calculate the angle and position for each button
      const angle = (360 / this.printPositionService.PRINT_POSITIONS_COUNT) * printPosition;
      const angleInRadians = (angle * Math.PI) / 180;
      const centerX = radius - buttonSize / 2;
      const centerY = radius - buttonSize / 2;
      const left = centerX + radius * Math.cos(angleInRadians) - buttonSize / 2;
      const top = centerY + radius * Math.sin(angleInRadians) - buttonSize / 2;

      const printPositionButtonStyleRaw = {
        ...this.printPositionService.getPrintPositionButtonStyle(
          printHead,
          printPosition,
          this.printPickerSizeMM,
          'printhead-component',
          pickerWell_to_plateWell_ratio
        ),
        left: `${left}px`,
        top: `${top}px`,
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
      };
      console.log('printPositionButtonStyleRaw: ', printPositionButtonStyleRaw);
      return printPositionButtonStyleRaw;
    } else {
      console.log('_getPrintPositionButtonStyle says no plate selected');
      return {};
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
      if (this.selectedPlate) { // Add this check
        this.printPositionService.repopulatePrintPositionButtons(this.selectedPlate.well_sizeMM, printHead, undefined);
      }
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
    return this.screenUtils.convertMMToPX(size_in_mm);
  }

  private getNextColor(): string {
    const currentColorIndex = this.printHeads.length % this.colors.length;
    return this.colors[currentColorIndex];
  }
}

