import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadSyringeExtrusionRateComponent } from './printhead-syringe-extrusion-rate.component';

describe('PrintheadSyringeExtrusionRateComponent', () => {
  let component: PrintheadSyringeExtrusionRateComponent;
  let fixture: ComponentFixture<PrintheadSyringeExtrusionRateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadSyringeExtrusionRateComponent]
    });
    fixture = TestBed.createComponent(PrintheadSyringeExtrusionRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
