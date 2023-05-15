import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";

@Component({
  selector: 'app-printhead-emd-valve-cycle-time',
  templateUrl: './printhead-emd-valve-cycle-time.component.html',
  styleUrls: ['./printhead-emd-valve-cycle-time.component.css']
})
export class PrintheadEmdValveCycleTimeComponent {
  @Input() printhead!: Printhead
}
