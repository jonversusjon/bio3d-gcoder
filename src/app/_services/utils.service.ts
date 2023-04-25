import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public alphabet_upperCase = [...Array(26)].map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i).toUpperCase());

  constructor() {
  }
/*Destructuring: You can use destructuring to extract properties from an object into
 separate variables. For example, given an object person with properties name and age,
 you can extract both properties like this: const { name, age } = person;
 */



};



