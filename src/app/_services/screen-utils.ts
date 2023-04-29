import { Injectable } from '@angular/core';

@Injectable()
export class ScreenUtils {
  private ppi: number | undefined;

  convertMMToPX(mm: number, message?: string): number {
    const scalar = 3.78; // this is px/mm
    // const inches = mm / 25.4;
    // const PX = inches * this.getPPI() * scalar;
    const PX = mm * scalar;
    if(message) {
      console.log('convertMMToPX message: ', message, ' PX: ', PX);
    }
    return PX;
  }

  getPPI(): number {
    if (!this.ppi) {
      const screenWidthInDevicePixels = window.screen.width * window.devicePixelRatio;
      const screenHeightInDevicePixels = window.screen.height * window.devicePixelRatio;

      // Assuming 96 PPI as a standard value, adjust if you have a different value
      const assumedPPI = 96;

      const screenWidthInInches = screenWidthInDevicePixels / assumedPPI;
      const screenHeightInInches = screenHeightInDevicePixels / assumedPPI;

      const diagonalInDevicePixels = Math.sqrt(Math.pow(screenWidthInDevicePixels, 2) + Math.pow(screenHeightInDevicePixels, 2));
      const diagonalInInches = Math.sqrt(Math.pow(screenWidthInInches, 2) + Math.pow(screenHeightInInches, 2));

      this.ppi = diagonalInDevicePixels / diagonalInInches;
    }
    return this.ppi;
  }
}
