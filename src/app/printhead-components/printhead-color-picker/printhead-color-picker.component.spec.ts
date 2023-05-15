import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadColorPickerComponent } from './printhead-color-picker.component';

describe('ColorPickerComponent', () => {
  let component: PrintheadColorPickerComponent;
  let fixture: ComponentFixture<PrintheadColorPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadColorPickerComponent]
    });
    fixture = TestBed.createComponent(PrintheadColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
