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
import {
  IContext,
  IContextPropertyType,
  IGenericPropertyType,
  ISchema,
} from '@app/core/model'
import {
  ContextPropertyTypeService,
  ContextService,
  GenericPropertyTypeService,
  SchemaService,
} from '@core/service'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

import { BaseFormDirective } from '../../../common/base-form.class'
import { ErrorSets } from '../../../user-controls/field-error/field-error.directive'

@Component({
  selector: 'app-context-property-type-dialog',
  templateUrl: './context-property-type-dialog.component.html',
  styleUrls: ['./context-property-type-dialog.component.scss'],
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
export class ContextPropertyTypeDialogComponent
  extends BaseFormDirective<IContextPropertyType>
  implements OnInit, OnChanges
{
  ErrorSets = ErrorSets

  constructor(
    private formBuilder: FormBuilder,
    private ContextService: ContextService,
    private ContextPropertyTypeService: ContextPropertyTypeService,
    private GenericPropertyTypeService: GenericPropertyTypeService,
    private SchemaService: SchemaService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IContextPropertyType,
    private dialogRef: MatDialogRef<ContextPropertyTypeDialogComponent>
  ) {
    super()
  }

  isHidden = true
  private isPatching = false

  contextList: { id: string; name: string }[] = []

  initContext() {
    const params = {
      sortColumn: 'name',
      sortDirection: 'asc',
      isActive: true,
    }
    return this.ContextService.find(params).subscribe({
      next: (response) => {
        this.contextList = response.data.map((type: IContext) => ({
          id: type.id,
          name: type.name,
        }))
        const ctrl = this.formGroup.get('idContext')
        // Only set if not already set
        if (ctrl && !ctrl.value && this.contextList.length > 0) {
          ctrl.setValue(this.contextList[0].id)
          console.log('Initialized idContext to:', this.contextList[0].id)
        }
      },
      error: (err) => {
        console.error('Error during search:', err)
      },
    })
  }

  schemaList: { id: string; name: string }[] = []

  initSchema() {
    const params = {
      sortColumn: 'name',
      sortDirection: 'asc',
      isActive: true,
    }
    return this.SchemaService.find(params).subscribe({
      next: (response) => {
        this.schemaList = response.data.map((type: ISchema) => ({
          id: type.id,
          name: type.name,
        }))
        const ctrl = this.formGroup.get('idSchema')
        // Only set if not already set
        if (ctrl && !ctrl.value && this.schemaList.length > 0) {
          ctrl.setValue(this.schemaList[0].id)
          console.log('Initialized idSchema to:', this.schemaList[0].id)
        }
      },
      error: (err) => {
        console.error('Error during search:', err)
      },
    })
  }
  genericPropertyTypeList: { id: string; name: string }[] = []

  initGenericPropertyType() {
    const params = {
      sortColumn: 'name',
      sortDirection: 'asc',
      isActive: true,
    }
    return this.GenericPropertyTypeService.find(params).subscribe({
      next: (response) => {
        this.genericPropertyTypeList = response.data.map(
          (type: IGenericPropertyType) => ({
            id: type.id,
            name: type.name,
          })
        )
        const ctrl = this.formGroup.get('idGenericPropertyType')
        // Only set if not already set
        if (ctrl && !ctrl.value && this.genericPropertyTypeList.length > 0) {
          ctrl.setValue(this.genericPropertyTypeList[0].id)
          console.log(
            'Initialized idGenericPropertyType to:',
            this.genericPropertyTypeList[0].id
          )
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
    this.initContext()
    this.initGenericPropertyType()
    this.initSchema()
    // Debouncer for the name field
    this.formGroup
      .get('name')
      ?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((name) => {
          const id = this.data?.id || null // Handle null id
          return this.ContextPropertyTypeService.isAvailable(id, name)
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

    this.ContextPropertyTypeService.deactReact(this.formGroup.getRawValue()).subscribe({
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
    this.ContextPropertyTypeService.delete(this.formGroup.getRawValue()).subscribe({
      next: () => {
        console.log('Record deleted successfully')
      },
      error: (err) => {
        console.error('Error saving data:', err)
      },
    })
  }

  buildForm(initialData?: IContextPropertyType | null): FormGroup {
    const ContextPropertyType = initialData
    return this.formBuilder.group({
      // ContextPropertyType Fields
      id: [ContextPropertyType?.id || '', Validators.nullValidator],
      idContext: [ContextPropertyType?.idContext || '', Validators.nullValidator],
      contextName: [ContextPropertyType?.contextName || ''],
      idGenericPropertyType: [ContextPropertyType?.idGenericPropertyType || ''],
      genericPropertyTypeName: [ContextPropertyType?.genericPropertyTypeName || ''],
      idSchema: [ContextPropertyType?.idSchema || ''],
      schemaName: [ContextPropertyType?.schemaName || ''],
      length: [ContextPropertyType?.length || ''],
      scale: [ContextPropertyType?.scale || ''],
      isNullable: [ContextPropertyType?.isNullable ?? false],
      defaultValue: [ContextPropertyType?.defaultValue || ''],

      // Audit Fields
      createdAt: [ContextPropertyType?.createdAt || '', Validators.nullValidator],
      createdBy: [ContextPropertyType?.createdBy || '', Validators.nullValidator],
      updatedAt: [ContextPropertyType?.updatedAt || '', Validators.nullValidator],
      updatedBy: [ContextPropertyType?.updatedBy || '', Validators.nullValidator],
      // Is Active
      isActive: [ContextPropertyType?.isActive ?? false, Validators.nullValidator],
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.disable ? this.formGroup?.disable() : this.formGroup?.enable()
    this.patchUpdatedDataIfChanged(changes)
  }

  submit(): void {
    if (this.formGroup.valid) {
      const formData = this.formGroup.getRawValue()

      this.ContextPropertyTypeService.persist(formData).subscribe({
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
