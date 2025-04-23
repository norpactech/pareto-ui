import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { map } from 'rxjs/operators'

import { DateTime } from 'luxon'

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
      return throwError(() => new Error('Context id is not set'));
    }
    return this.httpClient
      .get<IApiResponse<IContext>>(`${environment.baseUrl}/context?id=${id}`)
      .pipe(
        map((response) => {
          if (!response.data) {
            throw new Error('No context data found');
          }
          console.log(response.data)


          return Context.Build(response.data);
        })
      );
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
      return throwError(() => new Error('Null or undefined context data'));
    }
    else if (!data.id) {
      const params: { [key: string]: string } = {}
      params['name'] = data.name
      params['description'] = data.description
      params['createdBy'] = data.createdBy

      return this.httpClient.post<IApiResponse<IPersistResponse>>(`${environment.baseUrl}/context`, data).pipe(
        map((response) => {
          if (!response.data) {
            throw new Error('No context data found');
          }
          return response.data;
        })
      )
    }
    else {
      const params: { [key: string]: any } = {};

      const updatedAt = DateTime.fromJSDate(data.updatedAt);

      params['id'] = data.id;
      params['name'] = data.name;
      params['description'] = data.description;
      params['updatedAt'] = data.updatedAt.toISOString();
      params['updatedBy'] = data.updatedBy;

      console.log(`PUT BEING SENT: ${JSON.stringify(params)}`);

      return this.httpClient.put<IApiResponse<IPersistResponse>>(`${environment.baseUrl}/context`, params).pipe(
        map((response) => {
          console.log(response.data);

          if (!response.data) {
            throw new Error('No context data found');
          }
          return response.data;
        })
      );
    }
  }
}
