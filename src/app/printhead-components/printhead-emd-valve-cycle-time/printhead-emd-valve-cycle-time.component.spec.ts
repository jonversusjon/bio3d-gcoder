import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadEmdValveCycleTimeComponent } from './printhead-emd-valve-cycle-time.component';

describe('PrintheadEmdValveCycleTimeComponent', () => {
  let component: PrintheadEmdValveCycleTimeComponent;
  let fixture: ComponentFixture<PrintheadEmdValveCycleTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadEmdValveCycleTimeComponent]
    });
    fixture = TestBed.createComponent(PrintheadEmdValveCycleTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
