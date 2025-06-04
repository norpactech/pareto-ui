import { HttpClient } from '@angular/common/http'
import { inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ErrorDialogComponent } from '@common/dialogs/error-dialog.component'
import { IApiResponse, IPersistResponse } from '@service/model'
import { Observable, throwError } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  IChangePassword,
  IForgotPassword,
  ISignUp,
  ISignUpConfirmation,
} from '../../model/sign-up.dto'

export abstract class AuthenticationBaseService {
  protected readonly httpClient = inject(HttpClient)
  protected readonly dialog = inject(MatDialog)

  constructor(
    private baseUrl: string,
    private snackBar: MatSnackBar
  ) { }

  protected handleError(error: unknown): void {
    let errorMessage: string

    if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error, null, 2)
    } else {
      errorMessage = (error as string) || 'An unexpected error occurred.'
    }

    this.dialog.open(ErrorDialogComponent, {
      width: '400px',
      data: { message: errorMessage },
    })
  }

  public signUp(data: ISignUp): Observable<IPersistResponse> {
    if (!data) {
      return throwError(() => new Error('Null or undefined context data'))
    }
    const params: { [key: string]: string } = {
      username: data.username,
      password: data.password,
    }

    const request$ = this.httpClient.post<IApiResponse<IPersistResponse>>(
      `${this.baseUrl}`,
      params
    )

    return request$.pipe(
      map((response) => {
        if (!response.data) {
          if (response.error) {
            this.handleError(response.error)
            throw new Error(JSON.stringify(response.error))
          }
          throw new Error('No response data found')
        }
        this.snackBar.open('Record Successfully Saved', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
        return response.data
      })
    )
  }
  public signUpConfirmation(data: ISignUpConfirmation): Observable<IPersistResponse> {
    if (!data) {
      return throwError(() => new Error('Null or undefined context data'))
    }
    const params: { [key: string]: string } = {
      username: data.username,
      confirmationCode: data.confirmationCode,
    }

    const request$ = this.httpClient.post<IApiResponse<IPersistResponse>>(
      `${this.baseUrl}`,
      params
    )

    return request$.pipe(
      map((response) => {
        if (!response.data) {
          if (response.error) {
            this.handleError(response.error)
            throw new Error(JSON.stringify(response.error))
          }
          throw new Error('No response data found')
        }
        this.snackBar.open('Record Successfully Saved', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
        return response.data
      })
    )
  }

  public forgotPassword(data: IForgotPassword): Observable<IPersistResponse> {
    if (!data) {
      return throwError(() => new Error('Null or undefined context data'))
    }
    const params: { [key: string]: string } = {
      username: data.username,
    }

    const request$ = this.httpClient.post<IApiResponse<IPersistResponse>>(
      `${this.baseUrl}`,
      params
    )

    return request$.pipe(
      map((response) => {
        if (!response.data) {
          if (response.error) {
            this.handleError(response.error)
            throw new Error(JSON.stringify(response.error))
          }
          throw new Error('No response data found')
        }
        this.snackBar.open('Cofirmation code successfully sent to your email', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
        return response.data
      })
    )
  }
  public changePassword(data: IChangePassword): Observable<IPersistResponse> {
    if (!data) {
      return throwError(() => new Error('Null or undefined context data'))
    }
    const params: { [key: string]: string } = {
      username: data.username,
      confirmationCode: data.confirmationCode,
      password: data.password,
    }

    const request$ = this.httpClient.post<IApiResponse<IPersistResponse>>(
      `${this.baseUrl}`,
      params
    )

    return request$.pipe(
      map((response) => {
        if (!response.data) {
          if (response.error) {
            this.handleError(response.error)
            throw new Error(JSON.stringify(response.error))
          }
          throw new Error('No response data found')
        }
        this.snackBar.open('Password changed successfully.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
        return response.data
      })
    )
  }
}
