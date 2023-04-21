import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  private _baseStyles: { [key: string]: any } = {
    'custom-button-toggle': {
      'position': 'absolute',
      'border-radius': '50%',
      'border': '1px solid black',
      'aspect-ratio': '1 / 1'
    },
    // Add more base styles here
  };

  constructor() {}

  getBaseStyle(className: string): any {
    return this._baseStyles[className];
  }
}
