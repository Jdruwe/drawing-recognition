import { TestBed, inject } from '@angular/core/testing';

import { RecognizeService } from './recognize.service';

describe('RecognizeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecognizeService]
    });
  });

  it('should ...', inject([RecognizeService], (service: RecognizeService) => {
    expect(service).toBeTruthy();
  }));
});
