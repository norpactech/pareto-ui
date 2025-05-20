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
import { IGenericDataType, IGenericPropertyType, IValidation } from '@app/core/model'
import {
  GenericDataTypeService,
  GenericPropertyTypeService,
  ValidationService,
} from '@core/service'
import { TenantStateService } from '@core/state/tenant-state.service'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

import { BaseFormDirective } from '../../../common/base-form.class'
import { ErrorSets } from '../../../user-controls/field-error/field-error.directive'

@Component({
  selector: 'app-generic-property-type-dialog',
  templateUrl: './generic-property-type-dialog.component.html',
  styleUrls: ['./generic-property-type-dialog.component.scss'],
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
export class ContextDialogComponent
  extends BaseFormDirective<IGenericPropertyType>
  implements OnInit, OnChanges
{
  ErrorSets = ErrorSets

  constructor(
    private formBuilder: FormBuilder,
    private genericPropertyTypeService: GenericPropertyTypeService,
    private genericDataTypeService: GenericDataTypeService,
    private validationService: ValidationService,
    private tenantStateService: TenantStateService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IGenericPropertyType,
    private dialogRef: MatDialogRef<ContextDialogComponent>
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
    return this.genericDataTypeService.find(params).subscribe({
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

  validationList: { id: string | null; name: string }[] = []

  initValidation() {
    const params = {
      sortColumn: 'name',
      sortDirection: 'asc',
      isActive: true,
    }
    return this.validationService.find(params).subscribe({
      next: (response) => {
        // Add the null option first
        this.validationList = [
          { id: null, name: '' },
          ...response.data.map((type: IValidation) => ({
            id: type.id,
            name: type.name,
          })),
        ]
        const ctrl = this.formGroup.get('idValidation')
        // Only set if not already set
        if (ctrl && !ctrl.value && this.validationList.length > 0) {
          ctrl.setValue(this.validationList[0].id)
          console.log('Initialized idValidation to:', this.validationList[0].id)
        }
      },
      error: (err) => {
        console.error('Error during search:', err)
      },
    })
  }

  ngOnInit(): void {
    this.formGroup = this.buildForm(this.data)
    this.formReady.emit(this.formGroup)
    this.initGenericDataType()
    this.initValidation()

    // Debouncer for the name field
    this.formGroup
      .get('name')
      ?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((name) => {
          const id = this.data?.id || null // Handle null id
          return this.genericPropertyTypeService.isAvailable(id, name)
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

    this.genericPropertyTypeService.deactReact(this.formGroup.getRawValue()).subscribe({
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
    this.genericPropertyTypeService.delete(this.formGroup.getRawValue()).subscribe({
      next: () => {
        console.log('Record deleted successfully')
      },
      error: (err) => {
        console.error('Error saving data:', err)
      },
    })
  }

  buildForm(initialData?: IGenericPropertyType | null): FormGroup {
    const genericPropertyType = initialData

    console.log('idTenant', genericPropertyType?.idTenant)
    return this.formBuilder.group({
      // Context Fields
      id: [genericPropertyType?.id || '', Validators.nullValidator],
      idTenant: [genericPropertyType?.idTenant || '', Validators.nullValidator],
      idGenericDataType: [
        genericPropertyType?.idGenericDataType || '',
        Validators.nullValidator,
      ],
      idValidation: [genericPropertyType?.idValidation || ''],
      name: [genericPropertyType?.name || '', Validators.nullValidator],
      description: [genericPropertyType?.description || '', Validators.nullValidator],
      length: [genericPropertyType?.length || '', Validators.nullValidator],
      scale: [genericPropertyType?.scale || '', Validators.nullValidator],
      isNullable: [genericPropertyType?.isNullable ?? false, Validators.nullValidator],
      defaultValue: [genericPropertyType?.defaultValue || '', Validators.nullValidator],

      // Audit Fields
      createdAt: [genericPropertyType?.createdAt || '', Validators.nullValidator],
      createdBy: [genericPropertyType?.createdBy || '', Validators.nullValidator],
      updatedAt: [genericPropertyType?.updatedAt || '', Validators.nullValidator],
      updatedBy: [genericPropertyType?.updatedBy || '', Validators.nullValidator],
      // Is Active
      isActive: [genericPropertyType?.isActive ?? false, Validators.nullValidator],
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.disable ? this.formGroup?.disable() : this.formGroup?.enable()
    this.patchUpdatedDataIfChanged(changes)
  }

  submit(): void {
    if (this.formGroup.valid) {
      const formData = this.formGroup.getRawValue()

      const tenant = this.tenantStateService.getTenant()
      console.log('tenant', tenant)
      console.log('tenant.id', tenant?.id)

      formData.idTenant = '402a1c12-dd5d-4cfd-847c-a5a81f21b610'

      if (!formData.idTenant) {
        if (tenant?.id) {
          formData.idTenant = '402a1c12-dd5d-4cfd-847c-a5a81f21b610'
        }
      }
      this.genericPropertyTypeService.persist(formData).subscribe({
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
