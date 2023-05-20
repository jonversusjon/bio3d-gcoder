import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";

@Component({
  selector: 'app-printhead-camera-filename',
  templateUrl: './printhead-camera-filename.component.html',
  styleUrls: ['./printhead-camera-filename.component.css']
})
export class PrintheadCameraFilenameComponent {
  @Input() printhead!: Printhead;
  @Input() filename!: string | null;
}
