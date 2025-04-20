import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { tap } from 'rxjs/operators'
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

  getContexts(): Observable<IContext[]> {
    return this.httpClient
      .get<IApiResponse<IContext[]>>(`${environment.baseUrl}/context/search`)
      .pipe(
        tap((response) => console.log('API Response:', response)),
        map((response) => response.data ?? [])
      )
  }
}
