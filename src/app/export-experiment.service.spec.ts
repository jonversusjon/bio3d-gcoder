import { TestBed } from '@angular/core/testing';

import { ExportExperimentService } from './export-experiment.service';

describe('ExportExperimentService', () => {
  let service: ExportExperimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportExperimentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
