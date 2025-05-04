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

// import { FlexModule } from '@ngbracket/ngx-layout/flex'
import { BaseFormDirective } from '../../../common/base-form.class'
import { ConfirmationDialogComponent } from '../../../common/is-active.component'
import { ErrorSets } from '../../../user-controls/field-error/field-error.directive'
import { IContext } from './context'
import { ContextService } from './context.service'

@Component({
  selector: 'app-context-dialog',
  templateUrl: './context-dialog.component.html',
  styleUrls: ['./context-dialog.component.scss'],
  imports: [
    ReactiveFormsModule,
    //        FlexModule,
    MatFormFieldModule,
    MatInputModule,
    //        FieldErrorDirective,
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
  extends BaseFormDirective<IContext>
  implements OnInit, OnChanges
{
  ErrorSets = ErrorSets

  constructor(
    private formBuilder: FormBuilder,
    private contextService: ContextService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IContext,
    private dialogRef: MatDialogRef<ContextDialogComponent>
  ) {
    super()
  }

  isHidden = true
  private isPatching = false

  toggleVisibility(): void {
    this.isHidden = !this.isHidden
  }

  ngOnInit(): void {
    this.formGroup = this.buildForm(this.data)
    this.formReady.emit(this.formGroup)

    // Subscribe to isActive value changes
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
    this.contextService.deactReact(this.formGroup.getRawValue()).subscribe({
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

        const action = isActive ? 'Activated' : 'Deactivated'
        this.snackBar.open(`Record Successfully ${action}.`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
      },
      error: (err) => {
        console.error('Error saving data:', err)
      },
    })
  }

  buildForm(initialData?: IContext | null): FormGroup {
    const context = initialData
    return this.formBuilder.group({
      // Context Fields
      id: [context?.id || '', Validators.nullValidator],
      name: [context?.name || '', Validators.nullValidator],
      description: [context?.description || '', Validators.nullValidator],
      // Audit Fields
      createdAt: [context?.createdAt || '', Validators.nullValidator],
      createdBy: [context?.createdBy || '', Validators.nullValidator],
      updatedAt: [context?.updatedAt || '', Validators.nullValidator],
      updatedBy: [context?.updatedBy || '', Validators.nullValidator],
      // Is Active
      isActive: [context?.isActive ?? false, Validators.nullValidator],
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.disable ? this.formGroup?.disable() : this.formGroup?.enable()
    this.patchUpdatedDataIfChanged(changes)
  }

  submit(): void {
    if (this.formGroup.valid) {
      const formData = this.formGroup.getRawValue()
      console.log('Form submitted:', formData)

      this.contextService.persist(formData).subscribe({
        next: (response) => {
          console.log('Data saved successfully:', response)
          this.dialogRef.close(true)
        },
        error: (err) => {
          console.error('Error saving data:', err)
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
