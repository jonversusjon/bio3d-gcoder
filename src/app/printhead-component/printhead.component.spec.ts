import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadComponent } from './printhead.component';

describe('PrintheadSetupComponent', () => {
  let component: PrintheadComponent;
  let fixture: ComponentFixture<PrintheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintheadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
