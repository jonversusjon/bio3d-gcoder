import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPositionPickerComponent } from './print-position-picker.component';

describe('PrintPositionPickerComponent', () => {
  let component: PrintPositionPickerComponent;
  let fixture: ComponentFixture<PrintPositionPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintPositionPickerComponent]
    });
    fixture = TestBed.createComponent(PrintPositionPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
