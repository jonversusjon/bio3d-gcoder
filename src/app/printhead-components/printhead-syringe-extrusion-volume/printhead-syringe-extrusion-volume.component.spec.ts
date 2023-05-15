import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadSyringeExtrusionVolumeComponent } from './printhead-syringe-extrusion-volume.component';

describe('PrintheadSyringeExtrusionVolumeComponent', () => {
  let component: PrintheadSyringeExtrusionVolumeComponent;
  let fixture: ComponentFixture<PrintheadSyringeExtrusionVolumeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadSyringeExtrusionVolumeComponent]
    });
    fixture = TestBed.createComponent(PrintheadSyringeExtrusionVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
