import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-print-depth',
  templateUrl: './print-depth.component.html',
  styleUrls: ['./print-depth.component.css']
})
export class PrintDepthComponent {
  @Input() wellDepthMM: number = 16.5;
  @Input() activeToggle: boolean = false;
  @Output() startDepthChange = new EventEmitter<number>();
  @Output() endDepthChange = new EventEmitter<number>();

  public startDepth: number = 0;
  public endDepth: number = 0;

  constructor() { }

  onStartDepthChange(value: number) {
    this.startDepth = value;
    this.startDepthChange.emit(this.startDepth);
  }

  onEndDepthChange(value: number) {
    this.endDepth = value;
    this.endDepthChange.emit(this.endDepth);
  }
}
