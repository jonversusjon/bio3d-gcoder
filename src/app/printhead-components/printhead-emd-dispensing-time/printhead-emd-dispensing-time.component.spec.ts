import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadEmdDispensingTimeComponent } from './printhead-emd-dispensing-time.component';

describe('PrintheadEmdDispensingTimeComponent', () => {
  let component: PrintheadEmdDispensingTimeComponent;
  let fixture: ComponentFixture<PrintheadEmdDispensingTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadEmdDispensingTimeComponent]
    });
    fixture = TestBed.createComponent(PrintheadEmdDispensingTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
