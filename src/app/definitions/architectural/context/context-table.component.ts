import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  inject,
  ViewChild,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatRippleModule } from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatToolbarModule } from '@angular/material/toolbar'
import { ActivatedRoute, Router } from '@angular/router'
import { FlexModule } from '@ngbracket/ngx-layout/flex'
import { merge, Observable, of, Subject } from 'rxjs'
import { tap } from 'rxjs/operators'
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators'
import { MatDialog } from '@angular/material/dialog';
import { ContextDialogComponent } from './context-dialog.component';

import { IContext } from './context'
import { ContextService } from './context.service'

@Component({
  selector: 'app-context-table',
  templateUrl: './context-table.component.html',
  styleUrls: ['./context-table.component.scss'],
  standalone: true,
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
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class ContextTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  private dialog: MatDialog = inject(MatDialog);

  private skipLoading = false
  private readonly ContextService = inject(ContextService)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly destroyRef = inject(DestroyRef)

  readonly refresh$ = new Subject<void>()

  items$!: Observable<IContext[]>
  displayedColumns = computed(() => ['id', 'name', 'description'])

  isLoading = true
  resultsLength = 0
  hasError = false
  errorText = ''
  selectedRow?: IContext

  search = new FormControl<string>('', null)

  resetPage(stayOnPage = false) {
    if (!stayOnPage) {
      this.paginator.firstPage()
    }
    this.router.navigate([], {
      relativeTo: this.activatedRoute, // Stay on the current route
      queryParamsHandling: 'merge', // Keep existing query parameters
    })
    this.selectedRow = undefined
  }

  showDetail(id: string): void {

    this.ContextService.getContext(id).subscribe({
      next: (context: IContext) => {
        const dialogRef = this.dialog.open(ContextDialogComponent, {
          width: '800px',
          data: context, // Pass the entire IContext object to the dialog
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log('Dialog result:', result);
            // Handle the result (e.g., save changes)
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch context data:', err);
      },
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange
      .pipe(
        tap(() => this.resetPage()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe()

    this.paginator.page
      .pipe(
        tap(() => this.resetPage(true)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe()

    if (this.skipLoading) {
      return
    }

    setTimeout(() => {
      this.items$ = merge(
        this.refresh$,
        this.sort.sortChange,
        this.paginator.page,
        this.search.valueChanges.pipe(
          debounceTime(1000),
          tap(() => this.resetPage())
        )
      ).pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true
          return this.ContextService.getContexts(
            this.paginator.pageSize,
            this.search.value as string,
            this.paginator.pageIndex,
            this.sort.active,
            this.sort.direction
          )
        }),
        map((results: { total: number; data: IContext[] }) => {
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
    })
  }
}
