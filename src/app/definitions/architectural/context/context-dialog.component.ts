import { Component, OnChanges, OnInit, SimpleChanges, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseFormDirective } from '../../../common/base-form.class';
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

    const context = initialData
    return this.formBuilder.group({
      id: [context?.id || '', Validators.nullValidator],
      name: [context?.name || '', Validators.nullValidator],
      description: [context?.description || '', Validators.nullValidator],
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.disable ? this.formGroup?.disable() : this.formGroup?.enable()
    this.patchUpdatedDataIfChanged(changes)
  }

  save(): void {
    if (this.formGroup.valid) {
      const formData = this.formGroup.getRawValue(); // Get form values, including disabled fields
      console.log('Form submitted:', formData);
      // Perform save logic here (e.g., call a service to save the data or close the dialog with the result)
    } else {
      console.error('Form is invalid');
    }
  }
}
