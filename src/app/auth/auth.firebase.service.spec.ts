import { provideHttpClientTesting } from '@angular/common/http/testing'
import { inject, TestBed } from '@angular/core/testing'
import { Auth as FireAuth } from '@angular/fire/auth'

import { UiService } from '../common/ui.service'
import { FirebaseAuthService } from './auth.firebase.service'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const angularFireStub = {
  user: jasmine.createSpyObj('user', ['subscribe']),
  auth: jasmine.createSpyObj('auth', ['signInWithEmailAndPassword', 'signOut']),
}

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        FirebaseAuthService,
        UiService,
        { provide: FireAuth, useValue: angularFireStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
  })

  it('should be created', inject(
    [FirebaseAuthService],
    (service: FirebaseAuthService) => {
      expect(service).toBeTruthy()
    }
  ))
})
