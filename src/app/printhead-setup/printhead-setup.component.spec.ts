import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadSetupComponent } from './printhead-setup.component';

describe('PrintheadSetupComponent', () => {
  let component: PrintheadSetupComponent;
  let fixture: ComponentFixture<PrintheadSetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadSetupComponent]
    });
    fixture = TestBed.createComponent(PrintheadSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
