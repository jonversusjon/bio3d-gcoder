import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-printhead-led-intensity',
  templateUrl: './printhead-led-intensity.component.html',
  styleUrls: ['./printhead-led-intensity.component.css']
})
export class PrintheadLedIntensityComponent {
  @Input() printhead!: Printhead;

  ledIntensityControl = new FormControl('', [Validators.max(255)]);
}
