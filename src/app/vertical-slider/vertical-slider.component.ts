import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-vertical-slider',
  templateUrl: './vertical-slider.component.html',
  styleUrls: ['./vertical-slider.component.css'],
})
export class VerticalSliderComponent {
  startThumbPosition = 30;
  endThumbPosition = 60;
  startValue: number;
  endValue: number;
  currentThumb!: 'start' | 'end';
  max = 15;
  min = 0;
  tickSpacing = 100 / (this.max - this.min + 1);
  ticks = Array.from({ length: this.max - this.min }, (_, i) => {
    const value = i + 1;
    const isMajorTick = value % 5 == 0;
    return {
      value,
      label: value.toString(),
      width: isMajorTick ? '12px' : '8px',
      height: this.tickSpacing,
      left: isMajorTick ? '0px' : '2px',
      backgroundColor: isMajorTick ? 'rgba(64, 64, 64, 0.7)' : 'rgba(64, 64, 64, 0.3)',
      textLeft: '18px' ,
      textColor: isMajorTick ? 'grey' : 'transparent',
      bottom: (i * (1 / 15)) * 100 + '%'
    };
  });

  private draggingThumb: 'start' | 'end' | null = null;

  constructor(private el: ElementRef) {
    this.startValue = this.calculateValue(this.startThumbPosition);
    this.endValue = this.calculateValue(this.endThumbPosition);
    // console.log('ticks: ', this.ticks);
  }

  calculateValue(thumbPosition: number): number {
    return Math.round(((thumbPosition / 100) * (this.max - this.min)) + this.min);
  }

  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   if (this.draggingThumb) {
  //     const sliderRect = this.el.nativeElement.querySelector('.vertical-slider').getBoundingClientRect();
  //     const sliderHeight = sliderRect.height;
  //     const mouseY = event.clientY;
  //     let thumbPosition = ((sliderRect.bottom - mouseY) / sliderHeight) * 100;
  //
  //     // Keep the start thumb below the end thumb and vice versa
  //     if (this.draggingThumb === 'start' && thumbPosition >= this.endThumbPosition) {
  //       thumbPosition = this.endThumbPosition - this.tickSpacing;
  //     } else if (this.draggingThumb === 'end' && thumbPosition <= this.startThumbPosition) {
  //       thumbPosition = this.startThumbPosition + this.tickSpacing;
  //     }
  //
  //     // Keep the thumb inside the slider
  //     thumbPosition = Math.min(Math.max(thumbPosition, 0), 100);
  //
  //     if (this.draggingThumb === 'start') {
  //       this.startThumbPosition = thumbPosition;
  //       this.startValue = this.calculateValue(this.startThumbPosition);
  //     } else if (this.draggingThumb === 'end') {
  //       this.endThumbPosition = thumbPosition;
  //       this.endValue = this.calculateValue(this.endThumbPosition);
  //     }
  //   }
  // }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    this.draggingThumb = null;
  }

  onMouseDown(event: MouseEvent, thumb: 'start' | 'end') {
    this.draggingThumb = thumb;
    event.preventDefault();
  }

}

