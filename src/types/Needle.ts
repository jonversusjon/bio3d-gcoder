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
