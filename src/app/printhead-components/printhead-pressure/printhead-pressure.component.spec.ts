import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadPressureComponent } from './printhead-pressure.component';

describe('PrintheadPressureComponent', () => {
  let component: PrintheadPressureComponent;
  let fixture: ComponentFixture<PrintheadPressureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadPressureComponent]
    });
    fixture = TestBed.createComponent(PrintheadPressureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
