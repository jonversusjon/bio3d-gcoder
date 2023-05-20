import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";
import {PrintHeadStateService} from "../../_services/print-head-state.service";

@Component({
  selector: 'app-printhead-tool-position',
  templateUrl: './printhead-tool-position.component.html',
  styleUrls: ['./printhead-tool-position.component.css']
})
export class PrintheadToolPositionComponent {
  @Input() printhead!: Printhead;

  printheadToolPosition!: number;
  toolPositions!: number[];

  constructor(private printheadStateService: PrintHeadStateService) {
    this.toolPositions = [1,2,3,4,5,6,7,8,9,10];
  }
  ngOnInit() {
    this.printheadToolPosition = this.printhead.toolPosition || 1; // Use the printhead's toolPosition or default to 1
  }
  onPrintheadToolPositionChange(newPrintToolPosition: any) {
    console.log('printhead-tool-position.component onPrintheadToolPositionChange');
    this.printheadToolPosition = newPrintToolPosition;
    this.printheadStateService.updatePrintHeadProperty(this.printhead.index,'toolPosition', newPrintToolPosition);
  }
}
