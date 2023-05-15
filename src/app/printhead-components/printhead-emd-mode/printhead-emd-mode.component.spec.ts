import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadEmdModeComponent } from './printhead-emd-mode.component';

describe('PrintheadEmdModeComponent', () => {
  let component: PrintheadEmdModeComponent;
  let fixture: ComponentFixture<PrintheadEmdModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadEmdModeComponent]
    });
    fixture = TestBed.createComponent(PrintheadEmdModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
