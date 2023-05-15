import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";

@Component({
  selector: 'app-printhead-syringe-extrusion-volume',
  templateUrl: './printhead-syringe-extrusion-volume.component.html',
  styleUrls: ['./printhead-syringe-extrusion-volume.component.css']
})
export class PrintheadSyringeExtrusionVolumeComponent {
  @Input() printhead!: Printhead;
}
