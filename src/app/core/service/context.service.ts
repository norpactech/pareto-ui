import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ErrorDialogComponent } from '@common/dialogs/error-dialog.component' // Adjust the path as needed
import { environment } from '@environment/environment'
import {
  Context,
  IApiResponse,
  IContext,
  IContexts,
  IPersistResponse,
} from '@shared/models'
import { Observable, throwError } from 'rxjs'
import { map } from 'rxjs/operators'

export interface IContextService {
  getContext(id: string): Observable<IContext>
}

@Injectable({
  providedIn: 'root',
})
export class ContextService implements IContextService {
  private readonly httpClient = inject(HttpClient)
  private readonly dialog = inject(MatDialog)

  getContext(id: string | null): Observable<IContext> {
    if (!id) {
      return throwError(() => new Error('Context id is not set'))
    }
    return this.httpClient
      .get<IApiResponse<IContext>>(`${environment.baseUrl}/context?id=${id}`)
      .pipe(
        map((response) => {
          if (!response.data) {
            if (response.error) {
              this.handleError(response.error)
              throw new Error(JSON.stringify(response.error))
            }
            return new Context()
          }
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
    // isActive button is not checked (to inactive)
    if (isActive === false) {
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
      const params: { [key: string]: string } = {
        name,
        description,
        createdBy,
      }

      return this.httpClient
        .post<IApiResponse<IPersistResponse>>(`${environment.baseUrl}/context`, params)
        .pipe(
          map((response) => {
            if (!response.data) {
              if (response.error) {
                this.handleError(response.error)
                throw new Error(JSON.stringify(response.error))
              }
              throw new Error('No response data found')
            }
            return response.data
          })
        )
    } else {
      const { id, name, description, updatedAt } = data
      const updatedBy = 'Change Me!'
      const params: { [key: string]: string } = {
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
            if (!response.data) {
              if (response.error) {
                this.handleError(response.error)
                throw new Error(JSON.stringify(response.error))
              }
              throw new Error('No response data found')
            }
            return response.data
          })
        )
    }
  }

  deactReact(data: IContext): Observable<IPersistResponse> {
    if (!data) {
      return throwError(() => new Error('Null or undefined context data'))
    }
    const { id, updatedAt, isActive } = data
    const action = isActive ? 'react' : 'deact'
    const updatedBy = 'Change Me!'

    const params: { [key: string]: string } = {
      id,
      updatedAt: updatedAt.toISOString(),
      updatedBy,
    }

    return this.httpClient
      .put<
        IApiResponse<IPersistResponse>
      >(`${environment.baseUrl}/context/${action}`, params)
      .pipe(
        map((response) => {
          if (!response.data) {
            if (response.error) {
              this.handleError(response.error)
              throw new Error(JSON.stringify(response.error))
            }
            throw new Error('No response data found')
          }
          return response.data
        })
      )
  }

  delete(data: IContext): Observable<IPersistResponse> {
    if (!data) {
      return throwError(() => new Error('Null or undefined context data'))
    }
    const { id, updatedAt, updatedBy } = data
    const params = {
      id,
      updatedAt: updatedAt.toISOString(),
      updatedBy,
    }

    return this.httpClient
      .request<IApiResponse<IPersistResponse>>(
        'DELETE',
        `${environment.baseUrl}/context`,
        {
          body: params, // Include the JSON payload in the body
        }
      )
      .pipe(
        map((response) => {
          if (!response.data) {
            if (response.error) {
              this.handleError(response.error)
              throw new Error(JSON.stringify(response.error))
            }
            throw new Error('No response data found')
          }
          return response.data
        })
      )
  }

  handleError(error: unknown): void {
    let errorMessage: string

    if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error, null, 2)
    } else {
      errorMessage = (error as string) || 'An unexpected error occurred.'
    }

    this.dialog.open(ErrorDialogComponent, {
      width: '400px',
      data: { message: errorMessage },
    })
  }
}
