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
import { MatSelectModule } from '@angular/material/select'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfirmationDialogComponent } from '@app/common/dialogs/confirmation-dialog.component'
import { RefTableType } from '@app/core/enums'
import { IGenericDataType, IGenericDataTypeAttribute } from '@app/core/model'
import { GenericDataTypeAttributeService, GenericDataTypeService } from '@core/service'
import { TableUtils } from '@core/utils/table.utils'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

import { BaseFormDirective } from '../../../common/base-form.class'
import { ErrorSets } from '../../../user-controls/field-error/field-error.directive'

@Component({
  selector: 'app-generic-data-type-attribute-dialog',
  templateUrl: './generic-data-type-attribute-dialog.component.html',
  styleUrls: ['./generic-data-type-attribute-dialog.component.scss'],
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
    MatSelectModule,
  ],
})
export class GenericDataTypeAttributeDialogComponent
  extends BaseFormDirective<IGenericDataTypeAttribute>
  implements OnInit, OnChanges
{
  ErrorSets = ErrorSets

  constructor(
    private formBuilder: FormBuilder,
    private genericDataTypeAttributeService: GenericDataTypeAttributeService,
    private genericDataDataTypeService: GenericDataTypeService,
    private tableUtils: TableUtils,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IGenericDataTypeAttribute,
    private dialogRef: MatDialogRef<GenericDataTypeAttributeDialogComponent>
  ) {
    super()
  }

  isHidden = true
  private isPatching = false

  genericDataTypeList: { id: string; name: string }[] = []
  initGenericDataType() {
    const params = {
      sortColumn: 'name',
      sortDirection: 'asc',
      isActive: true,
    }
    return this.genericDataDataTypeService.find(params).subscribe({
      next: (response) => {
        this.genericDataTypeList = response.data.map((type: IGenericDataType) => ({
          id: type.id,
          name: type.name,
        }))
        const ctrl = this.formGroup.get('idGenericDataType')
        // Only set if not already set
        if (ctrl && !ctrl.value && this.genericDataTypeList.length > 0) {
          ctrl.setValue(this.genericDataTypeList[0].id)
          console.log('Initialized idGenericDataType to:', this.genericDataTypeList[0].id)
        }
      },
      error: (err) => {
        console.error('Error during search:', err)
      },
    })
  }

  attributeDataTypeList: { id: string; name: string }[] = []
  initAttributeDataType() {
    this.tableUtils.findRefTable(RefTableType.ATTR_DATA_TYPE).subscribe({
      next: (list) => {
        this.attributeDataTypeList = list
        const ctrl = this.formGroup.get('idRtAttrDataType')
        if (ctrl && !ctrl.value && list.length > 0) {
          ctrl.setValue(list[0].id)
          console.log('Initialized idRtAttrDataType to:', list[0].id)
        }
      },
      error: (err) => {
        console.error('Error fetching attribute data types:', err)
      },
    }) // Debouncer for the name field
  }

  ngOnInit(): void {
    this.formGroup = this.buildForm(this.data)
    this.formReady.emit(this.formGroup)
    this.initGenericDataType()
    this.initAttributeDataType()

    this.formGroup
      .get('name')
      ?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((name) => {
          const id = this.data?.id || null // Handle null id
          return this.genericDataTypeAttributeService.isAvailable(id, name)
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

    this.genericDataTypeAttributeService
      .deactReact(this.formGroup.getRawValue())
      .subscribe({
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
    this.genericDataTypeAttributeService.delete(this.formGroup.getRawValue()).subscribe({
      next: () => {
        console.log('Record deleted successfully')
      },
      error: (err) => {
        console.error('Error saving data:', err)
      },
    })
  }

  buildForm(initialData?: IGenericDataTypeAttribute | null): FormGroup {
    const genericDataTypeAttribute = initialData

    return this.formBuilder.group({
      // Context Fields
      id: [genericDataTypeAttribute?.id || '', Validators.nullValidator],
      idGenericDataType: [
        genericDataTypeAttribute?.idGenericDataType || '',
        Validators.nullValidator,
      ],
      idRtAttrDataType: [
        genericDataTypeAttribute?.idRtAttrDataType || '',
        Validators.nullValidator,
      ],
      name: [genericDataTypeAttribute?.name || '', Validators.nullValidator],
      description: [
        genericDataTypeAttribute?.description || '',
        Validators.nullValidator,
      ],

      // Audit Fields
      createdAt: [genericDataTypeAttribute?.createdAt || '', Validators.nullValidator],
      createdBy: [genericDataTypeAttribute?.createdBy || '', Validators.nullValidator],
      updatedAt: [genericDataTypeAttribute?.updatedAt || '', Validators.nullValidator],
      updatedBy: [genericDataTypeAttribute?.updatedBy || '', Validators.nullValidator],
      // Is Active
      isActive: [genericDataTypeAttribute?.isActive ?? false, Validators.nullValidator],
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.disable ? this.formGroup?.disable() : this.formGroup?.enable()
    this.patchUpdatedDataIfChanged(changes)
  }

  submit(): void {
    if (this.formGroup.valid) {
      const formData = this.formGroup.getRawValue()
      this.genericDataTypeAttributeService.persist(formData).subscribe({
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
