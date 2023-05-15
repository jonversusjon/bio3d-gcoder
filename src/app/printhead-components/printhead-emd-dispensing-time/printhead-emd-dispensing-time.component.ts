import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";

@Component({
  selector: 'app-printhead-emd-dispensing-time',
  templateUrl: './printhead-emd-dispensing-time.component.html',
  styleUrls: ['./printhead-emd-dispensing-time.component.css']
})
export class PrintheadEmdDispensingTimeComponent {
  @Input() printhead!: Printhead
}
