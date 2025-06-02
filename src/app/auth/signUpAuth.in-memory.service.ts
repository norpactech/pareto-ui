// to do focus on the UI while studying the signUp Functionality

// import { Injectable } from '@angular/core'
// import { sign } from 'fake-jwt-sign' // For InMemoryAuthService only
// import { Observable, of, throwError } from 'rxjs'

// import { PhoneType, User } from '../user/user/user'
// import { Role } from './auth.enum'
// // import { IAuthStatus, IServerAuthResponse } from './auth.service'
// import {
//   IAuthStatus,
//   IServerAuthResponse,
//   // SignUpService,
// } from './pages/sign-up/service/sign-up.service'

// @Injectable({
//   providedIn: 'root',
// })
// // export class InMemorySignUpAuthService extends SignUpService {
// //   // protected override signUpAuthProvider(email: string, password: string, repeatedPassword: string): Observable<IServerAuthResponse> {
// //   //   throw new Error('Method not implemented.')
// //   // }
// //   // LemonMart Server User Id: 5da01751da27cc462d265913
// //   private defaultUser = User.Build({
// //     _id: '5da01751da27cc462d265913',
// //     email: 'duluca@gmail.com',
// //     name: { first: 'Doguhan', last: 'Uluca' },
// //     picture: '',
// //     role: Role.Admin,
// //     dateOfBirth: new Date(1980, 1, 1),
// //     userStatus: true,
// //     address: {
// //       line1: '101 Sesame St.',
// //       city: 'Bethesda',
// //       state: 'Maryland',
// //       zip: '20810',
// //     },
// //     level: 2,
// //     phones: [
// //       {
// //         id: 0,
// //         type: PhoneType.Mobile,
// //         digits: '5555550717',
// //       },
// //     ],
// //   })

// //   constructor() {
// //     super()
// //     console.warn(
// //       "You're using the InMemoryAuthService. Do not use this service in production."
// //     )
// //   }

// //   protected authProvider(
// //     email: string,
// //     _password: string
// //   ): Observable<IServerAuthResponse> {
// //     email = email.toLowerCase()

// //     if (!email.endsWith('@test.com')) {
// //       return throwError(() => 'Failed to login! Email needs to end with @test.com.')
// //     }

// //     const authStatus = {
// //       isAuthenticated: true,
// //       userId: this.defaultUser._id,
// //       userRole: email.includes('user')
// //         ? Role.User
// //         : email.includes('admin')
// //           ? Role.Admin
// //           : Role.Anonymous,
// //     } as IAuthStatus

// //     this.defaultUser.role = authStatus.userRole

// //     const authResponse = {
// //       accessToken: sign(authStatus, 'secret', {
// //         expiresIn: '1h',
// //         algorithm: 'none',
// //       }),
// //     } as IServerAuthResponse

// //     return of(authResponse)
// //   }

// //   protected transformJwtToken(token: IAuthStatus): IAuthStatus {
// //     return token
// //   }

// //   protected getCurrentUser(): Observable<User> {
// //     return of(this.defaultUser)
// //   }
// // }
