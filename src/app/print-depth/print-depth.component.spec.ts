import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDepthComponent } from './print-depth.component';

describe('PrintDepthComponent', () => {
  let component: PrintDepthComponent;
  let fixture: ComponentFixture<PrintDepthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDepthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintDepthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
