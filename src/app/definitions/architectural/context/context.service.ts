import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { map } from 'rxjs/operators'

import { environment } from '../../../../environments/environment'
import { IApiResponse } from '../../../common/api-response'
import { IPersistResponse } from '../../../common/persist-response'
import { Context, IContext } from './context'
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
    if (!id) {
      return throwError(() => new Error('Context id is not set'))
    }
    return this.httpClient
      .get<IApiResponse<IContext>>(`${environment.baseUrl}/context?id=${id}`)
      .pipe(
        map((response) => {
          if (!response.data) {
            throw new Error('No context data found')
          }
          console.log(response.data)

          return Context.Build(response.data)
        })
      )
  }

  getContexts(
    limit: number,
    search: string,
    page: number,
    sortColumn: string,
    sortDirection: '' | 'asc' | 'desc' = 'asc',
    isActive: boolean
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
    if (isActive === true) {
      params['isActive'] = 'true'
    }

    return this.httpClient
      .get<IApiResponse<IContext[]>>(`${environment.baseUrl}/context/find`, { params })
      .pipe(
        map((response) => ({
          data: response.data ?? [],
          total: (response.data ?? []).length,
        }))
      )
  }

  persist(data: IContext): Observable<IPersistResponse> {
    if (!data) {
      return throwError(() => new Error('Null or undefined context data'))
    } else if (!data.id) {
      const { name, description, createdBy } = data
      const params: { [key: string]: any } = {
        name,
        description,
        createdBy,
      }

      return this.httpClient
        .post<IApiResponse<IPersistResponse>>(`${environment.baseUrl}/context`, params)
        .pipe(
          map((response) => {
            if (!response.data) {
              throw new Error('No context data found')
            }
            return response.data
          })
        )
    } else {
      const { id, name, description, updatedAt, updatedBy } = data
      const params: { [key: string]: any } = {
        id,
        name,
        description,
        updatedAt: updatedAt.toISOString(),
        updatedBy,
      }

      return this.httpClient
        .put<IApiResponse<IPersistResponse>>(`${environment.baseUrl}/context`, params)
        .pipe(
          map((response) => {
            console.log(response.data)

            if (!response.data) {
              throw new Error('No context data found')
            }
            return response.data
          })
        )
    }
  }
}
