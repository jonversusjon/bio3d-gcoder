import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";

@Component({
  selector: 'app-printhead-emd-valve-open-time',
  templateUrl: './printhead-emd-valve-open-time.component.html',
  styleUrls: ['./printhead-emd-valve-open-time.component.css']
})
export class PrintheadEmdValveOpenTimeComponent {
  @Input() printhead!: Printhead
}
