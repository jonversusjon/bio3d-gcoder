import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadNeedleSelectComponent } from './printhead-needle-select.component';

describe('NeedleSelectComponent', () => {
  let component: PrintheadNeedleSelectComponent;
  let fixture: ComponentFixture<PrintheadNeedleSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadNeedleSelectComponent]
    });
    fixture = TestBed.createComponent(PrintheadNeedleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
