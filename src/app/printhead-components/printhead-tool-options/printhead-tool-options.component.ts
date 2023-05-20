import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PrintheadTool} from "../../../types/PrintheadTool";
import {Printhead} from "../../../types/Printhead";
import {Needle, needles} from "../../../types/Needle";
import {Validators, FormControl, Form} from "@angular/forms";

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

  @Output() emdModeChanged: EventEmitter<string> = new EventEmitter<string>();

  wavelengthControl: FormControl<number | null> = new FormControl<number | null>(405);

  ledIntensityControl: FormControl<number | null> = new FormControl<number | null>
  (255, [Validators.min(1), Validators.max(255)]);

  fileNameControl: FormControl<string | null> = new FormControl<string | null>
  ('bio3dprint_img.jpg');
  emdModeControl: FormControl<string | null> = new FormControl<string | null>
  ('droplet');
  emdDispensingTimeControl: FormControl<number | null> = new FormControl<number | null>
  (1,[Validators.min(1), Validators.max(1200)]);
  emdValveCycleTimeControl: FormControl<number | null> = new FormControl<number | null>
  (1,[Validators.min(1), Validators.max(1200)]);
  emdValveOpenTimeControl: FormControl<number | null> = new FormControl<number | null>
  (1,[Validators.min(1), Validators.max(1200)]);
  temperatureControl: FormControl<number | null> = new FormControl<number | null>
  (1, [Validators.min(20), Validators.max(60)]);
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
