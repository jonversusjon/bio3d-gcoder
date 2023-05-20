import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";

@Component({
  selector: 'app-printhead-temperature',
  templateUrl: './printhead-temperature.component.html',
  styleUrls: ['./printhead-temperature.component.css']
})
export class PrintheadTemperatureComponent {
  @Input() printhead!: Printhead;
}
