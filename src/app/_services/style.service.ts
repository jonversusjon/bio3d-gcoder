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
      'aspect-ratio': '1 / 1',
      'box-sizing': 'content-box'
    },
      'plate-headers': {
        display: 'block',
        position: 'absolute',
        border: 'none',
        textAlign: 'center',
        marginTop: '0.25em',
        fontSize: '20px',
        fontWeight: 'bold',
        'color': '#555',
        'textShadow': '1px 1px 2px rgba(0,0,0,0.4)',
        backgroundClip: 'text',
      }

  };

  constructor() {}

  getBaseStyle(className: string): any {
    return this._baseStyles[className];
  }
}
