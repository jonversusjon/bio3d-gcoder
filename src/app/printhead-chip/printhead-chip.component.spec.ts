import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadChipComponent } from './printhead-chip.component';

describe('PrintheadChipComponent', () => {
  let component: PrintheadChipComponent;
  let fixture: ComponentFixture<PrintheadChipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadChipComponent]
    });
    fixture = TestBed.createComponent(PrintheadChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
