import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";

@Component({
  selector: 'app-printhead-pressure',
  templateUrl: './printhead-pressure.component.html',
  styleUrls: ['./printhead-pressure.component.css']
})
export class PrintheadPressureComponent {
  @Input() printhead!: Printhead;
}
