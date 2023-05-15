import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";
import {PrintheadTool} from "../../../types/PrintheadTool";

@Component({
  selector: 'app-printhead-led-wavelength',
  templateUrl: './printhead-led-wavelength.component.html',
  styleUrls: ['./printhead-led-wavelength.component.css']
})
export class PrintheadLedWavelengthComponent {
  @Input() printhead!: Printhead;
  @Input() selectedPrintheadTool!: PrintheadTool;
  public wavelength!: number;
}
