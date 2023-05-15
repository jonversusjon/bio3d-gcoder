import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadToolSelectComponent } from './printhead-tool-select.component';

describe('PrintheadTypeSelectComponent', () => {
  let component: PrintheadToolSelectComponent;
  let fixture: ComponentFixture<PrintheadToolSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadToolSelectComponent]
    });
    fixture = TestBed.createComponent(PrintheadToolSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
