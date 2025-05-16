import { CommonModule } from '@angular/common'
import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatDivider } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfirmationDialogComponent } from '@app/common/dialogs/confirmation-dialog.component'
import { IContextDataType } from '@app/core/model'
import { ContextDataTypeService } from '@core/service/context-data-type.service'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

import { BaseFormDirective } from '../../../common/base-form.class'
import { ErrorSets } from '../../../user-controls/field-error/field-error.directive'

@Component({
  selector: 'app-context-data-type-dialog',
  templateUrl: './context-data-type-dialog.component.html',
  styleUrls: ['./context-data-type-dialog.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    MatCardModule,
    MatDivider,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
})
export class ContextDialogComponent
  extends BaseFormDirective<IContextDataType>
  implements OnInit, OnChanges
{
  ErrorSets = ErrorSets

  constructor(
    private formBuilder: FormBuilder,
    private contextDataTypeService: ContextDataTypeService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IContextDataType,
    private dialogRef: MatDialogRef<ContextDialogComponent>
  ) {
    super()
  }

  isHidden = true
  private isPatching = false

  ngOnInit(): void {
    this.formGroup = this.buildForm(this.data)
    this.formReady.emit(this.formGroup)

    // Debouncer for the name field
    this.formGroup
      .get('name')
      ?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((name) => {
          const id = this.data?.id || null // Handle null id
          return this.contextDataTypeService.isAvailable(id, name)
        })
      )
      .subscribe({
        next: (isAvailable) => {
          const nameControl = this.formGroup.get('name')
          if (!isAvailable) {
            nameControl?.setErrors({ nameTaken: true })
            nameControl?.markAsTouched()
          } else {
            nameControl?.setErrors(null)
          }
          this.cdr.markForCheck()
        },
        error: (err) => {
          console.error('Error checking name availability:', err)
        },
      })

    this.formGroup.get('isActive')?.valueChanges.subscribe((isActive) => {
      if (this.isPatching) {
        return
      }
      this.confirmIsActive(isActive)
    })
  }

  confirmIsActive(isActive: boolean): void {
    const action = isActive ? 'Activate' : 'Deactivate'
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: `Are you sure you want to ${action} this record?` },
    })

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        this.isPatching = true
        this.formGroup.patchValue({ isActive: !isActive })
        this.isPatching = false
      } else {
        this.updateIsActive(isActive)
      }
    })
  }

  updateIsActive(isActive: boolean): void {
    console.log('updateIsActive', this.formGroup.getRawValue())

    this.contextDataTypeService.deactReact(this.formGroup.getRawValue()).subscribe({
      next: (response) => {
        const { updatedAt, updatedBy } = response

        this.isPatching = true
        this.formGroup.patchValue({
          isActive: isActive,
          updatedAt: new Date(updatedAt),
          updatedBy: updatedBy,
        })
        this.isPatching = false
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('Error saving data:', err)
      },
    })
  }

  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: `Are you sure you want to delete this record?` },
    })

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.delete()
        this.dialogRef.close(true)
      } else {
        this.snackBar.open('Delete Cancelled', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
      }
    })
  }

  delete(): void {
    this.contextDataTypeService.delete(this.formGroup.getRawValue()).subscribe({
      next: () => {
        console.log('Record deleted successfully')
      },
      error: (err) => {
        console.error('Error saving data:', err)
      },
    })
  }

  buildForm(initialData?: IContextDataType | null): FormGroup {
    const contextDataType = initialData
    return this.formBuilder.group({
      // Context Fields
      id: [contextDataType?.id || '', Validators.nullValidator],
      name: [contextDataType?.name || '', Validators.nullValidator],
      description: [contextDataType?.description || '', Validators.nullValidator],
      // Audit Fields
      createdAt: [contextDataType?.createdAt || '', Validators.nullValidator],
      createdBy: [contextDataType?.createdBy || '', Validators.nullValidator],
      updatedAt: [contextDataType?.updatedAt || '', Validators.nullValidator],
      updatedBy: [contextDataType?.updatedBy || '', Validators.nullValidator],
      // Is Active
      isActive: [contextDataType?.isActive ?? false, Validators.nullValidator],
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.disable ? this.formGroup?.disable() : this.formGroup?.enable()
    this.patchUpdatedDataIfChanged(changes)
  }

  submit(): void {
    if (this.formGroup.valid) {
      const formData = this.formGroup.getRawValue()

      this.contextDataTypeService.persist(formData).subscribe({
        next: () => {
          this.dialogRef.close(true)
        },
      })
    } else {
      console.error('Form is invalid')
      this.formGroup.markAllAsTouched()
    }
  }

  closeDialog(): void {
    console.log('Dialog closed')
    this.dialogRef.close(false)
  }
}
