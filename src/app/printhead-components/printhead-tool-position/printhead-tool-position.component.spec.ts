import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadToolPositionComponent } from './printhead-tool-position.component';

describe('PrintheadToolPositionComponent', () => {
  let component: PrintheadToolPositionComponent;
  let fixture: ComponentFixture<PrintheadToolPositionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadToolPositionComponent]
    });
    fixture = TestBed.createComponent(PrintheadToolPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
