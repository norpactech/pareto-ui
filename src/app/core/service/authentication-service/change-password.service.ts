/**
 * © 2025 Northern Pacific Technologies, LLC. All Rights Reserved.
 *
 * For license details, see the LICENSE file in this project root.
 */
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { environment } from '@environment/environment'

import { AuthenticationBaseService } from './authentication-base.service'

@Injectable({
  providedIn: 'root',
})
export class ChangePassword extends AuthenticationBaseService {
  constructor() {
    super(environment.cognitoBaseUrl + '/change-password', new MatSnackBar())
  }
}
