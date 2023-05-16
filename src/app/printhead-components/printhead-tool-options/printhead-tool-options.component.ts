import {Component, Input} from '@angular/core';
import {PrintheadTool} from "../../../types/PrintheadTool";
import {Printhead} from "../../../types/Printhead";

@Component({
  selector: 'app-printhead-tool-options',
  templateUrl: './printhead-tool-options.component.html',
  styleUrls: ['./printhead-tool-options.component.css']
})
export class PrintheadToolOptionsComponent {
  @Input() printhead!: Printhead;
  @Input() printheadIndex!: number;
  @Input() selectedPrintheadTool!: PrintheadTool;

  public wavelength!: number;
  emdMode!: string;


}
