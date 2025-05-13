import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { fetchAuthSession } from '@aws-amplify/auth'
import { signIn } from 'aws-amplify/auth'
import { from, mergeMap, Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { $enum } from 'ts-enum-util'

import { transformError } from '../common/common'
import { PhoneType, User } from '../user/user/user'
import { Role } from './auth.enum'
import { AuthService, IAuthStatus, IServerAuthResponse } from './auth.service'
interface IJwtToken {
  email: string
  role: string
  picture: string
  iat: number
  exp: number
  sub: string
  'cognito:groups'?: string[]
}
@Injectable({
  providedIn: 'root',
})
export class CustomAuthService extends AuthService {
  private httpClient: HttpClient = inject(HttpClient)

  // TODO: Remove this when after the server is ready
  private defaultUser = User.Build({
    _id: '5da01751da27cc462d265913',
    email: 'duluca@gmail.com',
    name: { first: 'Doguhan', last: 'Uluca' },
    picture: '',
    role: Role.Admin,
    dateOfBirth: new Date(1980, 1, 1),
    userStatus: true,
    address: {
      line1: '101 Sesame St.',
      city: 'Bethesda',
      state: 'Maryland',
      zip: '20810',
    },
    level: 2,
    phones: [
      {
        id: 0,
        type: PhoneType.Mobile,
        digits: '5555550717',
      },
    ],
  })

  protected authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse> {
    return from(
      signIn({
        username: email,
        password: password,
      })
    ).pipe(
      mergeMap(() => from(fetchAuthSession())), // Fetch the session after sign-in
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((session: any) => {
        console.log('Session:', session)

        return {
          idToken: session.tokens.accessToken.toString(),
          accessToken: session.tokens.idToken.toString(),
          refreshToken: session.tokens.refreshToken?.toString() || '',
        } as IServerAuthResponse
      }),
      catchError(transformError)
    )
  }
  protected transformJwtToken(token: IJwtToken): IAuthStatus {
    const cognitoGroups = token['cognito:groups']

    console.log('Decoded Role:', cognitoGroups)

    console.log('isAuthenticated:', token.email)

    return {
      isAuthenticated: token.email ? true : false,
      userId: token.sub,
      userRole: $enum(Role).asValueOrDefault(
        cognitoGroups?.[0] ?? Role.Anonymous,
        Role.Anonymous
      ),
      userEmail: token.email,
      userPicture: token.picture,
    } as IAuthStatus
  }

  protected getCurrentUser(): Observable<User> {
    return of(this.defaultUser)
    /*
    // TODO: Use this when the server is ready
    return this.httpClient.get<IUser>(`${environment.baseUrl}/v1/auth/me`).pipe(
      first(),
      map((user) => User.Build(user)),
      catchError(transformError)
    )
*/
  }
}
