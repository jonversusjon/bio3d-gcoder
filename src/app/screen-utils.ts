import { Injectable } from '@angular/core';

@Injectable()
export class ScreenUtils {
  private ppi: number | undefined;

  convertMMToPPI(mm: number): number {
    const scalar = 1.0;
    const inches = mm / 25.4;
    const PPI = inches * this.getPPI() * scalar
    return Math.round(PPI);
  }

  getPPI(): number {
    if (!this.ppi) {
      const screenWidthInDevicePixels = window.screen.width;
      const screenHeightInDevicePixels = window.screen.height;

      const screenWidthInInches = screenWidthInDevicePixels / window.devicePixelRatio / 96;
      const screenHeightInInches = screenHeightInDevicePixels / window.devicePixelRatio / 96;

      const diagonalInDevicePixels = Math.sqrt(Math.pow(screenWidthInDevicePixels, 2) + Math.pow(screenHeightInDevicePixels, 2));
      const diagonalInInches = Math.sqrt(Math.pow(screenWidthInInches, 2) + Math.pow(screenHeightInInches, 2));

      this.ppi = diagonalInDevicePixels / diagonalInInches;
    }
    return this.ppi;
  }


}
