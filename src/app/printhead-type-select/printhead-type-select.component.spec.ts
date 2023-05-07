import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadTypeSelectComponent } from './printhead-type-select.component';

describe('PrintheadTypeSelectComponent', () => {
  let component: PrintheadTypeSelectComponent;
  let fixture: ComponentFixture<PrintheadTypeSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadTypeSelectComponent]
    });
    fixture = TestBed.createComponent(PrintheadTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
