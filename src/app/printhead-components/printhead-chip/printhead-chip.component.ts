import {Component, Input} from '@angular/core';
import {Printhead} from "../../../types/Printhead";
import {StyleService} from "../../_services/style.service";

@Component({
  selector: 'app-printhead-chip',
  templateUrl: './printhead-chip.component.html',
  styleUrls: ['./printhead-chip.component.css']
})
export class PrintheadChipComponent {
  @Input() printhead!: Printhead;

  constructor(private styleService: StyleService,) {
  }
  get iconUrlStyle(): string {
    return `url(${this.printhead.tool.iconUrl})`
  }

  protected readonly print = print;

  get gradientStyle() {
    const gradientColors = this.styleService.getColorFromTemperature(this.printhead.temperature);
    return `linear-gradient(45deg, ${gradientColors.lowTempColor}, ${gradientColors.highTempColor})`;
  }
}
