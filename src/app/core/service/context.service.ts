import { Injectable } from '@angular/core'
import { environment } from '@environment/environment'
import { IContext } from '@shared/models'
import { BaseService } from './base.service';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root',
})
export class ContextService extends BaseService<IContext> {
  constructor() {
    super(`${environment.baseUrl}/context`, new MatSnackBar())
  }
}