import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleSelectionComponent } from './rectangle-selection.component';

describe('SelectionRectangleComponent', () => {
  let component: RectangleSelectionComponent;
  let fixture: ComponentFixture<RectangleSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RectangleSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RectangleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
