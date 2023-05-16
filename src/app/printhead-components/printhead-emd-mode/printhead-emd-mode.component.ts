import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Printhead} from "../../../types/Printhead";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-printhead-emd-mode',
  templateUrl: './printhead-emd-mode.component.html',
  styleUrls: ['./printhead-emd-mode.component.css']
})
export class PrintheadEmdModeComponent implements OnInit {
  @Input() printhead!: Printhead;
  @Input() emdMode: string = 'droplet';
  @Output() emdModeChanged: EventEmitter<string> = new EventEmitter<string>();

  public emdModes = ['droplet','continuous'];
  ngOnInit() {
    this.emdModeChanged.emit(this.emdMode); // Emit the initial value
  }
  onEmdModeChange(event: MatSelectChange) {
    const newMode: string = event.value;
    this.emdMode = newMode;
    this.emdModeChanged.emit(newMode);
  }
}
