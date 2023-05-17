import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {StyleService} from "../../_services/style.service";
import { Printhead} from "../../../types/Printhead";
import {Subscription} from "rxjs";
import {PrintHeadStateService} from "../../_services/print-head-state.service";
import {PlateFormat} from "../../../types/PlateFormat";
import {PlateFormatService} from "../../_services/plate-format.service";
import {PrintPositionService} from "../../_services/print-position.service";
import {Well} from "../../../types/Well";
import {PrintPosition} from "../../../types/PrintPosition";

@Component({
  selector: 'app-printhead-setup',
  templateUrl: './printhead-setup.component.html',
  styleUrls: ['./printhead-setup.component.css']
})
export class PrintheadSetupComponent implements OnDestroy, OnInit, OnChanges {
  @Input() selectedPlate!: PlateFormat;
  @Input() wellDiamMM!: number;

  experimentSetupHeaderStyle: any;
  printHeadCountInput: number = 1;
  printHeads: Printhead[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private styleService: StyleService,
              private printHeadStateService: PrintHeadStateService,
              private plateFormatService: PlateFormatService,
              private printPositionService: PrintPositionService) {
    this.subscriptions.push(
      this.printHeadStateService.printHeads$.subscribe((printHeads: Printhead[]) => {
        console.log('printhead-setup-component received: ', printHeads);
        this.printHeads = printHeads;
      }),
      this.plateFormatService.selectedPlate$.subscribe((plate) => {
        console.log('print-head-setup-component received: ', plate);
        this.selectedPlate = plate;
        this.onGetSelectedPlateChange(plate);
      })
    );

    this.experimentSetupHeaderStyle = this.styleService.getBaseStyle('experiment-setup-header');

  }

  ngOnInit() {

  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnChanges(changes:SimpleChanges) {
    console.log('changes: ', changes);
    if (changes['selectedPlate']) {

      if (this.printHeads.length > 0) {
        for(let printhead of this.printHeads) {
          this.updateButtonsSize(printhead, this.selectedPlate.well_sizeMM, printhead.needle.odMM);
        }
      } else {
        console.log('no printheads to respond to selected plate change');
      }
    }
  }
  onPrintHeadCountChange() {
    this.printHeadStateService.onPrintHeadCountChange(this.printHeadCountInput);
  }

  updateButtonsSize(printHead: Printhead, plateMapWellSize: number, needleOdMM: number) {
    // this.printPositionService.getNewButtonsSize('print-head', printHead, plateMapWellSize, needleOdMM);
  }

  onGetSelectedPlateChange(selectedPlate: PlateFormat) {
    for(let printhead of this.printHeads) {
      this.printPositionService.updatePrintPositionsBasedOnNeedle(printhead, selectedPlate.well_sizeMM, printhead.needle.odMM);
    }
  }
}
