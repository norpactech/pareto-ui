import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { environment } from '@environment/environment'
import { IContextDataType } from '@shared/models'

import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root',
})
export class ContextDataTypeService extends BaseService<IContextDataType> {
  constructor() {
    super(`${environment.baseUrl}/context-data-type`, new MatSnackBar())
  }
}
