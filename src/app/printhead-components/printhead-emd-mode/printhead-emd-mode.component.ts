import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";

@Component({
  selector: 'app-printhead-emd-mode',
  templateUrl: './printhead-emd-mode.component.html',
  styleUrls: ['./printhead-emd-mode.component.css']
})
export class PrintheadEmdModeComponent {
  @Input() printhead!: Printhead
  public emdModes = ['droplet','continuous'];
  onEmdModeChange(event: any) {

  }
}
