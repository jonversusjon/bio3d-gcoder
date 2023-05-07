import { Injectable } from '@angular/core';

export const INACTIVE_COLOR = '#808080';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  public THEME_COLORS: any = {
    'colorblindSafeDefault' : ['#4477AA','#CCBB44','#AA3377','#66CCEE','#EE6677','#228833','#BBBBBB'],
    'defaultLightTheme' : ['#FF1F5B','#00CD6C','#009ADE','#AF58BA','#FFC61E','#F28522','#A0B1BA','#A6761D'],
  }
  private _baseStyles: { [key: string]: any } = {
    'well': {
      position: 'relative',
      borderRadius: '50%',
      border: '1px solid black',
      aspectRatio: '1 / 1',
      boxSizing: 'border-box',
    },
    'print-position-button': {
      position: 'absolute',
      borderRadius: '50%',
      border: '1px solid grey',
      aspectRatio: '1 / 1',
      boxSizing: 'border-box'
    },
      'plate-headers': {
        display: 'block',
        position: 'absolute',
        border: 'none',
        textAlign: 'center',
        marginTop: '0.25em',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#555',
        textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
        backgroundClip: 'text',
      },
    'experiment-setup-header': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0',


      color: 'white',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    }

  };

  constructor() {}

  getBaseStyle(className: string): any {
    return this._baseStyles[className];
  }
}
