import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RectangleSelectionService {
  selectionRectangleStart: {row: number, col: number} | null = null;
  selectionRectangleVisible = false;
  constructor() { }
}
