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
      }
  };

  constructor() {}

  getBaseStyle(className: string): any {
    return this._baseStyles[className];
  }

  private colors = [
    '#ff00ff',// 246
    '#cc02c5',// 232
    '#99038a',// 220
    '#660450',// 208
    '#330616',// 196
    '#491325',// 180
    '#5e1d32',// 168
    '#74283f',// 156
    '#88324d',// 144
    '#88324d',// 132
    '#aa7353',// 120
    '#b38c5a',// 108
    '#b4a06c',// 96
    '#baac7b',// 84
    '#a9a881',// 72
    '#8c9a86',// 60
    '#728c89',// 48
    '#f1f4f3',// 36
    '#eaeeed',// 24
    '#e3e8e7',// 12
    '#1144FF' // 0
  ].reverse();

  getColorFromTemperature(temp: number) {
    const colorIndexHigh: number = Math.floor(temp / 12) < this.colors.length ?
      Math.floor(temp / 12) : this.colors.length;

    const colorIndexLow: number = Math.floor(temp / 12) > 2?
      Math.floor(temp / 12) - 2 : 0;

    return {
      'highTempColor': this.colors[colorIndexHigh],
      'lowTempColor': this.colors[colorIndexLow]
    };
  }

}

