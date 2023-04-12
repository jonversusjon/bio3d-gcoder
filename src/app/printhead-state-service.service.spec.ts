import { TestBed } from '@angular/core/testing';

import { PrintheadStateServiceService } from './printhead-state-service.service';

describe('PrintheadStateServiceService', () => {
  let service: PrintheadStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintheadStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
