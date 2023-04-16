import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHeadSetupComponent } from './printhead-setup.component';

describe('PrintheadSetupComponent', () => {
  let component: PrintHeadSetupComponent;
  let fixture: ComponentFixture<PrintHeadSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintHeadSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintHeadSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
