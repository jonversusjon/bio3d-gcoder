import {Coordinates} from "./Coordinates";

export interface Needle {
  name: string;
  odMM: number;
  color: string
}

export function emptyNeedle(): Needle {
  return {
    name: '',
    odMM: 0,
    color: 'white'
  }
}

export const needles:Needle[] = [
  {name: '27ga', odMM: 0.42, color: 'white'},
  {name: '25ga', odMM: 0.53, color: 'red'},
  {name: '23ga', odMM: 0.63, color: 'orange'},
  {name: '22ga', odMM: 0.70, color: 'blue'},
  {name: '21ga', odMM: 0.83, color: 'purple'},
  {name: '20ga', odMM: 0.91, color: 'pink'},
  {name: '18ga', odMM: 1.27, color: 'green'},
  {name: '16ga', odMM: 1.63, color: 'grey'},
  {name: '15ga', odMM: 1.65, color: 'amber'},
  {name: '14ga', odMM: 1.83, color: 'olive'}
];
