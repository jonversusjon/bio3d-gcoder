import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalibrationService {
  private xCalibration = new BehaviorSubject<number>(1);
  private yCalibration = new BehaviorSubject<number>(1);
  private zCalibration = new BehaviorSubject<number>(1);

  xCalibration$ = this.xCalibration.asObservable();
  yCalibration$ = this.yCalibration.asObservable();
  zCalibration$ = this.zCalibration.asObservable();

  constructor() { }

  setXCalibration(value: number) {
    this.xCalibration.next(value);
  }

  setYCalibration(value: number) {
    this.yCalibration.next(value);
  }

  setZCalibration(value: number) {
    this.zCalibration.next(value);
  }
}
