import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Needle, needles} from "../../../types/Needle";
import {Printhead} from "../../../types/Printhead";
import {FormControl} from "@angular/forms";
// TODO: update needle select with mat tooltip giving info about the selected needle (odMM, color, etc.)
@Component({
  selector: 'app-printhead-needle-select',
  templateUrl: './printhead-needle-select.component.html',
  styleUrls: ['./printhead-needle-select.component.css']
})
export class PrintheadNeedleSelectComponent implements OnInit{
  @Input() printhead!: Printhead;
  @Input() selectedNeedle!: Needle;
  @Output() needleChanged: EventEmitter<Needle> = new EventEmitter<Needle>();
  availableNeedles:Needle[] = [];

  needleControl!: FormControl;

  constructor() {
    this.availableNeedles = needles;
  }

  ngOnInit() {
    this.needleControl = new FormControl(this.printhead.needle);
    this.needleControl.setValue(needles[0]);
    this.needleControl.valueChanges.subscribe((value) => {
      this.needleChanged.emit(value);
    });
  }

}


