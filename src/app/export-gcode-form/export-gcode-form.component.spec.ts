import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportGcodeFormComponent } from './export-gcode-form.component';

describe('ExportGcodeFormComponent', () => {
  let component: ExportGcodeFormComponent;
  let fixture: ComponentFixture<ExportGcodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportGcodeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportGcodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
