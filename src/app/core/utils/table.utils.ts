import { Injectable } from '@angular/core'
import { IRefTables, IRefTableType } from '@app/core/model'
import { RefTablesService, RefTableTypeService } from '@core/service'
import { Observable, throwError } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class TableUtils {
  constructor(
    private refTableTypeService: RefTableTypeService,
    private refTablesService: RefTablesService
  ) {}
  /**
   * Finds and maps RefTables by RefTableType name.
   * @param refTableTypeName The name of the RefTableType to search for.
   * @returns Observable of id/name list.
   */
  findRefTable(refTableTypeName: string): Observable<{ id: string; name: string }[]> {
    const params = {
      searchColumn: 'name',
      searchValue: refTableTypeName,
    }
    return this.refTableTypeService.find(params).pipe(
      map((response) => response.data?.[0] as IRefTableType | null),
      switchMap((refTableType) => {
        if (!refTableType) {
          return throwError(() => new Error('No RefTableType found'))
        }
        const tableParams = {
          sortColumn: 'name',
          sortDirection: 'asc',
          searchColumn: 'idRefTableType',
          searchValue: refTableType.id,
        }
        return this.refTablesService.find(tableParams).pipe(
          map((response) =>
            response.data.map((type: IRefTables) => ({
              id: type.id,
              name: type.name,
            }))
          )
        )
      }),
      catchError((err) => {
        console.error('Error fetching attribute data types:', err)
        return throwError(() => err)
      })
    )
  }
}
