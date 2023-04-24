import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionRectangleComponent } from './selection-rectangle.component';

describe('SelectionRectangleComponent', () => {
  let component: SelectionRectangleComponent;
  let fixture: ComponentFixture<SelectionRectangleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionRectangleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionRectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
