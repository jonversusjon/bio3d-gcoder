import {Component, Input} from '@angular/core';
import {Printhead} from "../../types/Printhead";

@Component({
  selector: 'app-printhead-chip',
  templateUrl: './printhead-chip.component.html',
  styleUrls: ['./printhead-chip.component.css']
})
export class PrintheadChipComponent {
  @Input() printhead!: Printhead;

  get iconUrlStyle(): string {

    return `url(${this.printhead.tool.iconUrl})`
  }

  protected readonly print = print;
}
