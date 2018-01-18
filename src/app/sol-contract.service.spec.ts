import { TestBed, inject } from '@angular/core/testing';

import { SolContractService } from './sol-contract.service';

describe('SolContractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SolContractService]
    });
  });

  it('should be created', inject([SolContractService], (service: SolContractService) => {
    expect(service).toBeTruthy();
  }));
});
