import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadLedIntensityComponent } from './printhead-led-intensity.component';

describe('PrintheadLedIntensityComponent', () => {
  let component: PrintheadLedIntensityComponent;
  let fixture: ComponentFixture<PrintheadLedIntensityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadLedIntensityComponent]
    });
    fixture = TestBed.createComponent(PrintheadLedIntensityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
