import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintheadCameraFilenameComponent } from './printhead-camera-filename.component';

describe('PrintheadCameraFilenameComponent', () => {
  let component: PrintheadCameraFilenameComponent;
  let fixture: ComponentFixture<PrintheadCameraFilenameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintheadCameraFilenameComponent]
    });
    fixture = TestBed.createComponent(PrintheadCameraFilenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
