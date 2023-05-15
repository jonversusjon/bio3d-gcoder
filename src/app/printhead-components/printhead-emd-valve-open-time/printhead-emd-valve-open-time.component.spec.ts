import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadEmdValveOpenTimeComponent } from './printhead-emd-valve-open-time.component';

describe('PrintheadEmdValveOpenTimeComponent', () => {
  let component: PrintheadEmdValveOpenTimeComponent;
  let fixture: ComponentFixture<PrintheadEmdValveOpenTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadEmdValveOpenTimeComponent]
    });
    fixture = TestBed.createComponent(PrintheadEmdValveOpenTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
