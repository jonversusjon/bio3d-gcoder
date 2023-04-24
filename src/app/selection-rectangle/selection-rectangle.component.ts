import { Component } from '@angular/core';

@Component({
  selector: 'app-selection-rectangle',
  templateUrl: './selection-rectangle.component.html',
  styleUrls: ['./selection-rectangle.component.css']
})
export class SelectionRectangleComponent {
  selectionRectangleStart: {row: number, col: number} | null = null;
  selectionRectangleVisible = false;
}
