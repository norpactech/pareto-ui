import { CommonModule } from '@angular/common'
import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { MatDialogRef } from '@angular/material/dialog'
import { MatDivider } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { FlexModule } from '@ngbracket/ngx-layout/flex'
import { MatButtonModule } from '@angular/material/button';

import { BaseFormDirective } from '../../../common/base-form.class'
import {
  ErrorSets,
  FieldErrorDirective,
} from '../../../user-controls/field-error/field-error.directive'
import { IContext } from './context'
import { ContextService } from './context.service'

@Component({
  selector: 'app-context-dialog',
  templateUrl: './context-dialog.component.html',
  styleUrls: ['./context-dialog.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FlexModule,
    MatFormFieldModule,
    MatInputModule,
    FieldErrorDirective,
    MatDialogModule,
    CommonModule,
    MatCardModule,
    MatDivider,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatButtonModule,
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
    @Inject(MAT_DIALOG_DATA) public data: IContext,
    private dialogRef: MatDialogRef<ContextDialogComponent>
  ) {
    super()
  }

  isHidden = true

  toggleVisibility(): void {
    this.isHidden = !this.isHidden
  }

  ngOnInit(): void {
    this.formGroup = this.buildForm(this.data)
    this.formReady.emit(this.formGroup)
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
          this.dialogRef.close(response)
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
}
