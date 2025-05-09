import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse, IPersistResponse, IDeactReact } from '@shared/models'
import { IBaseEntity } from '@app/shared/models/base-entity.dto';
import { MatDialog } from '@angular/material/dialog'
import { ErrorDialogComponent } from '@common/dialogs/error-dialog.component'
import { MatSnackBar } from '@angular/material/snack-bar'

export abstract class BaseService<T extends IBaseEntity>  {
  protected readonly httpClient = inject(HttpClient);
  protected readonly dialog = inject(MatDialog)

  constructor(private baseUrl: string, private snackBar: MatSnackBar) {}

public get(id: string): Observable<T | null> {
  if (!id) {
    return throwError(() => new Error('Context id is not set'));
  }

  return this.httpClient
    .get<IApiResponse<T>>(`${this.baseUrl}?id=${id}`)
    .pipe(
      map((response) => {
        if (!response.data) {
          if (response.error) {
            this.handleError(response.error);
            throw new Error(JSON.stringify(response.error));
          }
          return null; // Return null if no data is found
        }
        return response.data;
      })
    );
}
  public find(
    limit: number,
    search: string,
    page: number,
    sortColumn: string,
    sortDirection: '' | 'asc' | 'desc' = 'asc',
    isActive: boolean
): Observable<{ data: T[]; total: number }> {
    const params: { [key: string]: string } = {}

    if (limit) {
      params['limit'] = limit.toString()
    }
    if (search) {
      params['name'] = `*${search}*`
    }
    if (page) {
      params['offset'] = page.toString()
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
      .get<IApiResponse<T[]>>(`${this.baseUrl}/find`, { params })
      .pipe(
        map((response) => ({
          data: response.data ?? [],
          total: response.meta?.count ?? 0,
        }))
      )
  }

  public isAvailable(id: string | null, name: string): Observable<boolean> {

    if (!name) {
      return throwError(() => new Error('Context name is not set'));
    }

    const params: { [key: string]: string } = {
      name: `${name}`,
    };

    return this.httpClient
      .get<IApiResponse<T[]>>(`${this.baseUrl}/find`, { params })
      .pipe(
        map((response) => {
          const count = response.meta?.count ?? 0;
          console.log('count', count);
          if (count === 0) {
            return true; // Name is available
          }

          const data = response.data?.[0];
          console.log('data', JSON.stringify(data));
          if (data?.id === id) {
            return true; // Name belongs to the same ID
          }
          return false; // Name belongs to a different ID or is already taken
        })
      );
  }

  public persist(data: Partial<T>): Observable<IPersistResponse> {

    if (!data) {
      return throwError(() => new Error('Null or undefined context data'));
    }
    const params: { [key: string]: string } = {};
    let isUpdate = false;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = value instanceof Date ? value.toISOString() : value.toString();
        if (key === 'id' && value) {
          isUpdate = true;
        }
      }
    });

    if (!isUpdate) {
      params['createdBy'] = 'Created By Change ME!'
    }
    else {
      params['updatedBy'] = 'Updated By Change ME!'
    }

    const request$ = isUpdate
      ? this.httpClient.put<IApiResponse<IPersistResponse>>(`${this.baseUrl}`, params)
      : this.httpClient.post<IApiResponse<IPersistResponse>>(`${this.baseUrl}`, params);

    return request$.pipe(
      map((response) => {
        if (!response.data) {
          if (response.error) {
            this.handleError(response.error);
            throw new Error(JSON.stringify(response.error));
          }
          throw new Error('No response data found');
        }
        this.snackBar.open('Record Successfully Saved', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
        return response.data;
      })
    );
  }

  public delete(data: Partial<T>): Observable<IPersistResponse> {

    if (!data) {
      return throwError(() => new Error('Null or undefined context data'));
    }

    if (!data.id) {
      return throwError(() => new Error('ID is required for deletion'));
    }
    const id = data.id?.toString(); // TypeScript now knows `id` exists
    const updatedBy = 'Deleted By Change ME!'; // Default value for updatedBy

    const params: { [key: string]: string } = {
      id,
      updatedBy
    };

    if (data.updatedAt) {
      params['updatedAt'] = data.updatedAt instanceof Date
      ? data.updatedAt.toISOString()
      : new Date(data.updatedAt as string).toISOString();
    }

    return this.httpClient
      .request<IApiResponse<IPersistResponse>>('DELETE', `${this.baseUrl}`, {
        body: params,
      })
      .pipe(
        map((response) => {
          if (!response.data) {
            if (response.error) {
              this.handleError(response.error);
              throw new Error(JSON.stringify(response.error));
            }
            throw new Error('No response data found');
          }
          this.snackBar.open(`Record Successfully Deleted`, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          })
          return response.data;
        })
      );
  }

  public deactReact(data: IDeactReact): Observable<IPersistResponse> {
    const { id, updatedAt, isActive } = data;
    const action = isActive ? 'Reactivated' : 'Deactivated';
    const updatedBy = 'Change Me!';

    const params: { [key: string]: string } = {
      id,
      updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : new Date(updatedAt as string).toISOString(),
      updatedBy,
    };

    return this.httpClient
      .put<IApiResponse<IPersistResponse>>(`${this.baseUrl}/${isActive ? 'react' : 'deact'}`, params)
      .pipe(
        map((response) => {
          if (!response.data) {
            throw new Error('No response data found');
          }
          this.snackBar.open(`Record Successfully ${action}.`, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          })
          return response.data;
        })
      );
  }

  protected handleError(error: unknown): void {
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