import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { inject, TestBed } from '@angular/core/testing'

import { TransactionService } from './transaction.service'

describe('TransactionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TransactionService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    })
  })

  it('should be created', inject([TransactionService], (service: TransactionService) => {
    expect(service).toBeTruthy()
  }))
})
