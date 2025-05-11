import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { environment } from '@environment/environment'
import { IContext } from '@shared/models'

import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root',
})
export class ContextService extends BaseService<IContext> {
  constructor() {
    super(`${environment.baseUrl}/context`, new MatSnackBar())
  }
}
