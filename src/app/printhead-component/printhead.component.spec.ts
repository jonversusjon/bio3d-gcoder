import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHeadComponent } from './printhead.component';

describe('PrintheadSetupComponent', () => {
  let component: PrintHeadComponent;
  let fixture: ComponentFixture<PrintHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
