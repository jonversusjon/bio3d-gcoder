import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Printhead} from "../../../types/Printhead";
import {MatSelectChange} from "@angular/material/select";
import {Needle} from "../../../types/Needle";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-printhead-emd-mode',
  templateUrl: './printhead-emd-mode.component.html',
  styleUrls: ['./printhead-emd-mode.component.css']
})
export class PrintheadEmdModeComponent {
  @Input() printhead!: Printhead;

  public emdModes = ['droplet', 'continuous'];

}
