/* eslint-disable prettier/prettier */
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthMode, Role } from '@app/auth/auth.enum'
import { UiService } from '@app/common/ui.service'
import { ConfimationCodeValidator, EmailValidation, PasswordValidation } from '@app/common/validations'
import { SignUp } from '@app/core/service/signUpService/signup.service'
import { SignUpConfirmation } from '@app/core/service/signUpService/signup-comfirmation.service'
import { FieldErrorDirective } from '@app/user-controls/field-error/field-error.directive'
import { environment } from '@environment/environment'
import { FlexModule } from '@ngbracket/ngx-layout'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  imports: [
    CommonModule,
    FlexModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FieldErrorDirective,
    MatButtonModule,
    MatExpansionModule,
    MatGridListModule,
    FormsModule
  ]
})
export class SignUpComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly uiService = inject(UiService)
  private readonly SignUp = inject(SignUp)
  private readonly SignUpConfirmation = inject(SignUpConfirmation)

  loginForm!: FormGroup
  confirmationCodeForm!: FormGroup
  loginError = ''
  roles = Object.keys(Role)
  authMode = environment.authMode
  AuthMode = AuthMode

  isConfirmationShow: boolean = false;
  isPasswordMatch: boolean = false;

  get redirectUrl() {
    return this.route.snapshot.queryParamMap.get('redirectUrl') || ''
  }

  ngOnInit() {
    this.buildLoginForm()
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', EmailValidation],
      password: ['', PasswordValidation],
      repeatPassword: ['', PasswordValidation],
    })

    this.confirmationCodeForm = this.formBuilder.group({
      confirmationCode: ['', ConfimationCodeValidator]
    })
  }

  handleConfirmationCode() {
    if (this.confirmationCodeForm.get('confirmationCode')?.value) {
      const params = {
        username: this.loginForm.get('email')?.value,
        confirmationCode: this.confirmationCodeForm.get('confirmationCode')?.value
      }
      this.SignUpConfirmation.signUpConfirmation(params).subscribe({
        next: (value) => {
          console.log('value: ', value)
          this.router.navigateByUrl('/login');
        },
      })
    }
  }

  async onSignUp() {
    this.isPasswordMatch = false;
    if (this.loginForm.get('password')?.value === this.loginForm.get('repeatPassword')?.value) {

      const params = {
        username: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      }

      this.SignUp.signUp(params).subscribe({
        next: (value) => {
          this.isConfirmationShow = true;
          console.log('value: ', value)
        },
      })
    } else {
      this.isPasswordMatch = true;
    }
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login')
  }
}
