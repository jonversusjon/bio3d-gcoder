import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateMapComponent } from './plate-map.component';

describe('PlateMapComponent', () => {
  let component: PlateMapComponent;
  let fixture: ComponentFixture<PlateMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlateMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlateMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
