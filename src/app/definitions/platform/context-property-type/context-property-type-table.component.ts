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
import { IContextPropertyType } from '@app/core/model'
import { ConfirmationDialogComponent } from '@common/dialogs/confirmation-dialog.component'
import { ContextPropertyTypeService } from '@core/service'
import { FlexModule } from '@ngbracket/ngx-layout/flex'
import { IDeactReact } from '@service/model'
import { merge, Observable, of, Subject } from 'rxjs'
import { tap } from 'rxjs/operators'
import { catchError, map, startWith, switchMap } from 'rxjs/operators'

import { ContextPropertyTypeDialogComponent } from './context-property-type-dialog.component'

@Component({
  selector: 'app-context-property-type-table',
  templateUrl: './context-property-type-table.component.html',
  styleUrls: ['./context-property-type-table.component.scss'],
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
    MatSelectModule,
  ],
})
export class ContextPropertyTypeTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  private readonly cdr = inject(ChangeDetectorRef)
  private dialog: MatDialog = inject(MatDialog)

  private readonly ContextPropertyTypeService = inject(ContextPropertyTypeService)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly destroyRef = inject(DestroyRef)

  readonly refresh$ = new Subject<void>()
  readonly isActiveColumn = signal(false)

  constructor(private snackBar: MatSnackBar) {}

  items$!: Observable<IContextPropertyType[]>
  displayedColumns = computed(() => [
    'contextName',
    'genericPropertyTypeName',
    'length',
    'scale',
    'isNullable',
    'defaultValue',
    ...(this.isActiveColumn() ? ['isActive'] : []),
  ])

  isLoading = true
  resultsLength = 0
  hasError = false
  errorText = ''
  selectedRow?: IContextPropertyType

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
    const dialogRef = this.dialog.open(ContextPropertyTypeDialogComponent, {
      width: '800px',
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

  confirmIsActive(isActive: boolean, row: IContextPropertyType): void {
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

  updateIsActive(event: MatCheckboxChange, row: IContextPropertyType): void {
    const isChecked = event.checked
    const params: IDeactReact = {
      id: row.id,
      updatedAt: row.updatedAt instanceof Date ? row.updatedAt : new Date(row.updatedAt),
      isActive: isChecked,
    }

    this.ContextPropertyTypeService.deactReact(params).subscribe({
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
    this.ContextPropertyTypeService.get(id).subscribe({
      next: (contextPropertyType: IContextPropertyType | null) => {
        // Otherwise there will be an aria-hidden="true" warning in the console
        const allElements = document.querySelectorAll('*')
        allElements.forEach((element) => {
          if (typeof (element as HTMLElement).blur === 'function') {
            ;(element as HTMLElement).blur()
          }
        })
        const dialogRef = this.dialog.open(ContextPropertyTypeDialogComponent, {
          width: '800px',
          data: contextPropertyType,
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
    this.items$ = merge(
      this.refresh$,
      this.sort.sortChange,
      this.paginator.page,
      this.isActive.valueChanges.pipe(tap(() => this.resetPage()))
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoading = true
        const params = {
          limit: this.paginator.pageSize,
          page: this.paginator.pageIndex,
          sortColumn: 'pareto.generic_property_type.name',
          sortDirection: this.sort.direction,
          isActive: this.isActive.value ?? true,
        }
        return this.ContextPropertyTypeService.find(params)
      }),
      map((results: { total: number; data: IContextPropertyType[] }) => {
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
