import { Injectable } from '@angular/core'
import {
  EntityActionOptions,
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { Context } from '../../../shared/models/context.dto'
import { ContextService } from '../../../core/service/context.service'

@Injectable({ providedIn: 'root' })
export class ContextEntityService extends EntityCollectionServiceBase<Context> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private contextService: ContextService
  ) {
    super('Context', serviceElementsFactory)
  }

  override getAll(_options?: EntityActionOptions): Observable<Context[]> {
    return this.contextService
      .getContexts()
      .pipe(map((contexts) => contexts.data.map(Context.Build)))
  }
}
