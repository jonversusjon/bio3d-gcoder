import { Injectable, Component } from '@angular/core';
import { RectangleSelectionService } from "../_services/rectangle-selection.service";

@Component({
  selector: 'app-rectangle-selection',
  templateUrl: './rectangle-selection.component.html',
  styleUrls: ['./rectangle-selection.component.css']
})
export class RectangleSelectionComponent {


  constructor(private rectangleSelectionService: RectangleSelectionService) {

  }
}
