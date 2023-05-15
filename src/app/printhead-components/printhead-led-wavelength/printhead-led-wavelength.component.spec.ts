import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadLedWavelengthComponent } from './printhead-led-wavelength.component';

describe('PrintheadLedWavelengthComponent', () => {
  let component: PrintheadLedWavelengthComponent;
  let fixture: ComponentFixture<PrintheadLedWavelengthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadLedWavelengthComponent]
    });
    fixture = TestBed.createComponent(PrintheadLedWavelengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
