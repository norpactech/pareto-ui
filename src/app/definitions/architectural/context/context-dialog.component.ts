import { Component, OnChanges, OnInit, SimpleChanges, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { BaseFormDirective } from '../../../common/base-form.class'
import { FlexModule } from '@ngbracket/ngx-layout/flex'
import {
  ErrorSets,
  FieldErrorDirective,
} from '../../../user-controls/field-error/field-error.directive'
import { ContextService } from './context.service';
import { IContext } from './context';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { MatDivider } from '@angular/material/divider'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

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
    @Inject(MAT_DIALOG_DATA) public data: IContext
  ) {
    super();
  }

  isHidden = true;

  toggleVisibility(): void {
    this.isHidden = !this.isHidden;
  }

  ngOnInit(): void {
    this.formGroup = this.buildForm(this.data)
    this.formReady.emit(this.formGroup)
  }

  buildForm(initialData?: IContext | null): FormGroup {

    console.log('Initial data:', initialData)

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

  save(): void {

    console.log('Saving Data: ', this.formGroup.value)

    if (this.formGroup.valid) {

      const formData = this.formGroup.getRawValue()
      console.log('Form submitted:', formData);

      this.contextService.persist(formData).subscribe({
        next: () => {
          console.log('Context saved successfully')
        },
        error: (err) => {
          console.error('Error saving context:', err)
        },
      });
    } else {
      console.error('Form is invalid')
    }
  }

  submit(): void {

    console.log('Submitting form...')
    console.log('Form value:', this.formGroup.value)

    if (this.formGroup.valid) {
      const formData = this.formGroup.getRawValue(); // Get all form values, including disabled fields
      console.log('Form submitted:', formData);

      // Call a service to save the data
      this.contextService.persist(formData).subscribe({
        next: (response) => {
          console.log('Data saved successfully:', response);
          // this.dialogRef.close(response); // Close the dialog and pass the response
        },
        error: (err) => {
          console.error('Error saving data:', err);
        },
      });
    }
    else {
      console.error('Form is invalid');
      this.formGroup.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
}
