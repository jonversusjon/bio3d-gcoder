import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";

@Component({
  selector: 'app-printhead-syringe-extrusion-rate',
  templateUrl: './printhead-syringe-extrusion-rate.component.html',
  styleUrls: ['./printhead-syringe-extrusion-rate.component.css']
})
export class PrintheadSyringeExtrusionRateComponent {
  @Input() printhead!: Printhead;
}
