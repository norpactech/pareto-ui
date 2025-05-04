import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router'
import { catchError, map } from 'rxjs/operators'

import { transformError } from '../../../common/common'
import { Context } from '../../../shared/models/context.dto'
import { ContextService } from '../../../core/service/context.service'

export const userResolver: ResolveFn<Context> = (route: ActivatedRouteSnapshot) => {
  return inject(ContextService)
    .getContext(route.paramMap.get('id'))
    .pipe(map(Context.Build), catchError(transformError))
}
