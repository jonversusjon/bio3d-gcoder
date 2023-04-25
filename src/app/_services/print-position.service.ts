import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import {PrintHeadButton} from "../../types/PrintHeadButton";

@Injectable({
  providedIn: 'root'
})
export class PrintPositionService {
  private _printPositionStateSource = new BehaviorSubject<PrintHeadButton[] | null>(null);
  printPositionState$ = this._printPositionStateSource.asObservable();

  constructor() { }
}
