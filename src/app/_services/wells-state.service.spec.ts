import { TestBed } from '@angular/core/testing';

import { WellsStateService } from './wells-state.service';

describe('WellsStateService', () => {
  let service: WellsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WellsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
