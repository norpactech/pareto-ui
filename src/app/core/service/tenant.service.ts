/**
 * © 2025 Northern Pacific Technologies, LLC. All Rights Reserved.
 *
 * For license details, see the LICENSE file in this project root.
 */
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ITenant } from '@app/core/model'
import { environment } from '@environment/environment'

import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root',
})
export class TenantService extends BaseService<ITenant> {
  constructor() {
    super(environment.baseUrl + '/tenant', new MatSnackBar())
  }
}
