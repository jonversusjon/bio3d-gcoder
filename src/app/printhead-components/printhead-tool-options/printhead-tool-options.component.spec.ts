import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadToolOptionsComponent } from './printhead-tool-options.component';

describe('PrintheadToolOptionsComponent', () => {
  let component: PrintheadToolOptionsComponent;
  let fixture: ComponentFixture<PrintheadToolOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadToolOptionsComponent]
    });
    fixture = TestBed.createComponent(PrintheadToolOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
