import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHeadCardComponent } from './print-head-card.component';

describe('PrintheadSetupComponent', () => {
  let component: PrintHeadCardComponent;
  let fixture: ComponentFixture<PrintHeadCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintHeadCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintHeadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
