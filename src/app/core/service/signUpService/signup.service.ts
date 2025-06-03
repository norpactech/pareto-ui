/**
 * © 2025 Northern Pacific Technologies, LLC. All Rights Reserved.
 *
 * For license details, see the LICENSE file in this project root.
 */
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { environment } from '@environment/environment'

import { SignUpBaseService } from './signup-base.service'

@Injectable({
  providedIn: 'root',
})
export class SignUp extends SignUpBaseService {
  constructor() {
    super(environment.cognitoBaseUrl + '/sign-up', new MatSnackBar())
  }
}
