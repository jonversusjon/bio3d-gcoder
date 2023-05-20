import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadTemperatureComponent } from './printhead-temperature.component';

describe('PrintheadTemperatureComponent', () => {
  let component: PrintheadTemperatureComponent;
  let fixture: ComponentFixture<PrintheadTemperatureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadTemperatureComponent]
    });
    fixture = TestBed.createComponent(PrintheadTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
