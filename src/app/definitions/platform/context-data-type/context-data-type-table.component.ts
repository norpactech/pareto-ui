import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core'
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox'
import { MatRippleModule } from '@angular/material/core'
import { MatDialog } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatToolbarModule } from '@angular/material/toolbar'
import { ActivatedRoute, Router } from '@angular/router'
import { IContext, IContextDataType } from '@app/core/model'
import { ConfirmationDialogComponent } from '@common/dialogs/confirmation-dialog.component'
import { ContextService } from '@core/service/context.service'
import { ContextDataTypeService } from '@core/service/context-data-type.service'
import { FlexModule } from '@ngbracket/ngx-layout/flex'
import { IDeactReact } from '@service/model'
import { merge, Observable, of, Subject } from 'rxjs'
import { tap } from 'rxjs/operators'
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators'

import { ContextDialogComponent } from './context-data-type-dialog.component'

@Component({
  selector: 'app-context-data-type-table',
  templateUrl: './context-data-type-table.component.html',
  styleUrls: ['./context-data-type-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FlexModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
  ],
})
export class ContextDataTypeTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  private readonly cdr = inject(ChangeDetectorRef)
  private dialog: MatDialog = inject(MatDialog)

  private readonly ContextDataTypeService = inject(ContextDataTypeService)
  private readonly ContextService = inject(ContextService)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly destroyRef = inject(DestroyRef)

  readonly refresh$ = new Subject<void>()
  readonly isActiveColumn = signal(false)

  constructor(private snackBar: MatSnackBar) {}

  items$!: Observable<IContextDataType[]>
  displayedColumns = computed(() => [
    'name',
    'description',
    'contextValue',
    'genericDataTypeName',
    ...(this.isActiveColumn() ? ['isActive'] : []),
  ])

  isLoading = true
  resultsLength = 0
  hasError = false
  errorText = ''
  selectedRow?: IContextDataType

  search = new FormControl<string>('', null)
  isActive = new FormControl(false)

  resetPage(stayOnPage = false) {
    if (!stayOnPage) {
      this.paginator.firstPage()
    }
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      skipLocationChange: true,
      queryParamsHandling: 'merge',
    })
    this.selectedRow = undefined
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(ContextDialogComponent, {
      width: '800px',
      data: null,
      autoFocus: true,
      restoreFocus: true,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open(`Record Successfully Saved`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
        this.refresh$.next()
      }
    })
  }

  confirmIsActive(isActive: boolean, row: IContextDataType): void {
    const allElements = document.querySelectorAll('*')
    allElements.forEach((element) => {
      if (typeof (element as HTMLElement).blur === 'function') {
        ;(element as HTMLElement).blur()
      }
    })

    const action = isActive ? 'Activate' : 'Deactivate'
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: `Are you sure you want to ${action} this record?` },
    })

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        row.isActive = !isActive
        this.cdr.detectChanges()
        const control = this.isActive
        control.patchValue(row.isActive)
      } else {
        this.updateIsActive({ checked: isActive } as MatCheckboxChange, row)
      }
    })
  }

  contextId = new FormControl()
  contextList = [{ id: '', name: '' }]

  onContextChange(selectedContextId: string) {
    console.log('Selected Context ID:', selectedContextId)
    this.contextId.setValue(selectedContextId)
    this.resetPage()
    this.refresh$.next()
  }

  initContext() {
    const params = {
      sortColumn: 'name',
      sortDirection: 'asc',
      isActive: true,
    }
    return this.ContextService.find(params).subscribe({
      next: (response) => {
        this.contextList = response.data.map((context: IContext) => ({
          id: context.id,
          name: context.name,
        }))
        if (this.contextList.length > 0) {
          this.contextId.setValue(this.contextList[0].id)
          console.log('Initialized contextId to:', this.contextList[0].id)
          this.refresh$.next()
        }
      },
      error: (err) => {
        console.error('Error during search:', err)
      },
    })
  }

  updateIsActive(event: MatCheckboxChange, row: IContextDataType): void {
    const isChecked = event.checked
    const params: IDeactReact = {
      id: row.id,
      updatedAt: row.updatedAt instanceof Date ? row.updatedAt : new Date(row.updatedAt),
      isActive: isChecked,
    }

    this.ContextDataTypeService.deactReact(params).subscribe({
      next: (response) => {
        row.isActive = isChecked
        row.updatedAt = new Date(response.updatedAt)
        row.updatedBy = response.updatedBy
        this.cdr.detectChanges()
      },
      error: (err) => {
        // Handle errors and revert the checkbox state
        console.error(`Failed to update row ${row.id}:`, err)
        row.isActive = !isChecked
        this.cdr.detectChanges()
      },
    })
  }

  showDetail(id: string): void {
    this.ContextDataTypeService.get(id).subscribe({
      next: (contextDataType: IContextDataType | null) => {
        // Otherwise there will be an aria-hidden="true" warning in the console
        const allElements = document.querySelectorAll('*')
        allElements.forEach((element) => {
          if (typeof (element as HTMLElement).blur === 'function') {
            ;(element as HTMLElement).blur()
          }
        })
        const dialogRef = this.dialog.open(ContextDialogComponent, {
          width: '800px',
          data: contextDataType,
          autoFocus: true,
          restoreFocus: true,
        })
        dialogRef.afterClosed().subscribe(() => {
          this.refresh$.next()
        })
      },
      error: (err) => {
        console.error('Failed to fetch context data:', err)
      },
    })
  }

  ngAfterViewInit() {
    this.initContext()

    this.items$ = merge(
      this.refresh$,
      this.sort.sortChange,
      this.paginator.page,
      this.search.valueChanges.pipe(
        debounceTime(1000),
        tap(() => this.resetPage())
      ),
      this.isActive.valueChanges.pipe(tap(() => this.resetPage()))
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoading = true
        const params = {
          idContext: this.contextId.value,
          limit: this.paginator.pageSize,
          search: this.search.value as string,
          page: this.paginator.pageIndex,
          sortColumn: this.sort.active,
          sortDirection: this.sort.direction,
          isActive: this.isActive.value ?? true,
        }
        return this.ContextDataTypeService.find(params)
      }),
      map((results: { total: number; data: IContextDataType[] }) => {
        this.isLoading = false
        this.hasError = false
        this.resultsLength = results.total

        return results.data
      }),
      catchError((err) => {
        this.isLoading = false
        this.hasError = true
        this.errorText = err
        return of([])
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    this.cdr.detectChanges()
  }
}
