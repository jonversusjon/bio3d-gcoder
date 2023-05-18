import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PrintheadTool} from "../../../types/PrintheadTool";
import {Printhead} from "../../../types/Printhead";
import {PrintHeadStateService} from "../../_services/print-head-state.service";
import {Needle, needles} from "../../../types/Needle";
import {PrintPositionService} from "../../_services/print-position.service";
import {ScreenUtils} from "../../_services/screen-utils";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-printhead-tool-options',
  templateUrl: './printhead-tool-options.component.html',
  styleUrls: ['./printhead-tool-options.component.css']
})
export class PrintheadToolOptionsComponent implements OnInit {
  @Input() printhead!: Printhead;
  @Input() printheadIndex!: number;
  @Input() selectedPrintheadTool!: PrintheadTool;
  @Input() well_diamMM!: number;
  emdModeControl = new FormControl('droplet');
  @Output() emdModeChanged: EventEmitter<string> = new EventEmitter<string>();

  public wavelength!: number;
  emdMode!: string;
  selectedNeedle!: Needle;

  constructor() {
  }

  ngOnInit() {
    this.selectedNeedle = needles[0];
    this.emdModeControl.valueChanges.subscribe((value:any) => {
      this.emdModeChanged.emit(value);
    });
  }
  onNeedleChanged(newNeedle: Needle) {
    this.selectedNeedle = newNeedle;
    // this.printPositionService.resizePrintPositions(this.printhead, this.wellDiamMM, newNeedle.odMM);
  }

  onNeedleChange(event: any) {
    this.selectedNeedle = event.value;
    this.printhead.needle = event.value;
  }
  onEmdModeChanged(newEmdMode: string) {
    // this.emdMode = newEmdMode;
  }
}
