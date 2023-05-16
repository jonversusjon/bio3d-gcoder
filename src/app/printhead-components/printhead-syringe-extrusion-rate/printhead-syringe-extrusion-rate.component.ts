import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-printhead-syringe-extrusion-rate',
  templateUrl: './printhead-syringe-extrusion-rate.component.html',
  styleUrls: ['./printhead-syringe-extrusion-rate.component.css']
})
export class PrintheadSyringeExtrusionRateComponent {
  @Input() printhead!: Printhead;

  // syringeExtrustionRate = new FormControl('', [Validators.max(255)]);

}
