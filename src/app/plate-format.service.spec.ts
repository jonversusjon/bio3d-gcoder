import { TestBed } from '@angular/core/testing';
import {PlateFormatService} from "./plate-format.service";


describe('PlateFormatService', () => {
  let service: PlateFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlateFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
