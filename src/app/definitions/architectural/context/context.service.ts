import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { map } from 'rxjs/operators'

import { environment } from '../../../../environments/environment'
import { IApiResponse } from '../../../common/api-response'
import { IContext } from './context'
export interface IContexts {
  data: IContext[]
  total: number
}

export interface IContextService {
  getContext(id: string): Observable<IContext>
}

@Injectable({
  providedIn: 'root',
})
export class ContextService implements IContextService {
  private readonly httpClient = inject(HttpClient)

  getContext(id: string | null): Observable<IContext> {
    if (id === null) {
      return throwError(() => 'Context id is not set')
    }
    return this.httpClient.get<IContext>(`${environment.baseUrl}/v2/context/${id}`)
  }

  getContexts(
    limit: number,
    search: string,
    page: number,
    sortColumn: string,
    sortDirection: '' | 'asc' | 'desc' = 'asc'
  ): Observable<IContexts> {
    const params: { [key: string]: string } = {}

    if (limit) {
      params['limit'] = limit.toString()
    }
    if (search) {
      params['name'] = `*${search}*`
    }
    if (page) {
      params['page'] = page.toString()
    }
    if (sortColumn) {
      params['sortColumn'] = sortColumn
    }
    if (sortDirection) {
      params['sortDirection'] = sortDirection
    }
    if (sortColumn === 'name') {
      params['sortColumn'] = 'name'
    }

    return this.httpClient
      .get<IApiResponse<IContext[]>>(`${environment.baseUrl}/context/table`, { params })
      .pipe(
        map((response) => ({
          data: response.data ?? [],
          total: (response.data ?? []).length,
        }))
      )
  }
}
