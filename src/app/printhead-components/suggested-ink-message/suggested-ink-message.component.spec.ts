import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedInkMessageComponent } from './suggested-ink-message.component';

describe('SuggestedInkMessageComponent', () => {
  let component: SuggestedInkMessageComponent;
  let fixture: ComponentFixture<SuggestedInkMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuggestedInkMessageComponent]
    });
    fixture = TestBed.createComponent(SuggestedInkMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
