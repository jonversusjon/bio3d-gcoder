import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-custom-slider',
  templateUrl: './custom-slider.component.html',
  styleUrls: ['./custom-slider.component.css'],
})
export class CustomSliderComponent {
  startThumbPosition = 30;
  endThumbPosition = 60;
  max = 15;
  min = 0;
  tickSpacing = 100 / (this.max - this.min);
  ticks = Array.from({ length: this.max - this.min }, (_, i) => i + 1);
  labels = [
    { value: 0, label: '0' },
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
  ];
  private draggingThumb: 'start' | 'end' | null = null;

  constructor(private el: ElementRef) {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.draggingThumb) {
      const sliderRect = this.el.nativeElement.querySelector('.slider').getBoundingClientRect();
      const sliderHeight = sliderRect.height;
      const mouseY = event.clientY;
      let thumbPosition = ((sliderRect.bottom - mouseY) / sliderHeight) * 100;

      // Keep the start thumb below the end thumb and vice versa
      if (this.draggingThumb === 'start' && thumbPosition >= this.endThumbPosition) {
        thumbPosition = this.endThumbPosition - this.tickSpacing;
      } else if (this.draggingThumb === 'end' && thumbPosition <= this.startThumbPosition) {
        thumbPosition = this.startThumbPosition + this.tickSpacing;
      }

      // Keep the thumb inside the slider
      thumbPosition = Math.min(Math.max(thumbPosition, 0), 100);

      if (this.draggingThumb === 'start') {
        this.startThumbPosition = thumbPosition;
      } else if (this.draggingThumb === 'end') {
        this.endThumbPosition = thumbPosition;
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    this.draggingThumb = null;
  }

  onMouseDown(event: MouseEvent, thumb: 'start' | 'end') {
    this.draggingThumb = thumb;
    event.preventDefault();
  }
}

