/* eslint-disable prettier/prettier */

import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router'
import { ChangePassword } from '@app/core/service/authentication-service/change-password.service'
import { ForgotPassword } from '@app/core/service/authentication-service/forgot-password.service'
import { FlexModule } from '@ngbracket/ngx-layout/flex'
import { combineLatest } from 'rxjs'
import { catchError, filter, first, tap } from 'rxjs/operators'

import { environment } from '../../../../environments/environment'
import { UiService } from '../../../common/ui.service'
import { ConfimationCodeValidator, EmailValidation, PasswordValidator } from '../../../common/validations'
import { FieldErrorDirective } from '../../../user-controls/field-error/field-error.directive'
import { AuthMode, Role } from '../../auth.enum'
import { AuthService } from '../../auth.service'
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrl: './login.component.css',
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
    MatProgressSpinnerModule
  ],
})
export class LoginComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly uiService = inject(UiService)
  private readonly ForgotPassword = inject(ForgotPassword)
  private readonly ChangePassword = inject(ChangePassword)

  loginForm!: FormGroup
  forgotPassword!: FormGroup
  changePassword!: FormGroup

  loginError = ''
  roles = Object.keys(Role)
  authMode = environment.authMode
  AuthMode = AuthMode

  displayType: string = 'login'; // set the display type based on the auth mode
  isConfirmationCodeSent: boolean = false;

  get redirectUrl() {
    return this.route.snapshot.queryParamMap.get('redirectUrl') || ''
  }

  ngOnInit() {
    this.authService.logout()
    this.buildLoginForm()
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', EmailValidation],
      password: ['', PasswordValidator],
    },
      {
        updateOn: 'blur'
      })

    this.forgotPassword = this.formBuilder.group({
      email: ['', EmailValidation],
    })

    this.changePassword = this.formBuilder.group({
      username: ['', Validators.required],
      confirmationCode: ['', ConfimationCodeValidator],
      newPassword: ['', PasswordValidator],
      repeatPassword: ['', PasswordValidator]
    },
      {
        updateOn: 'blur'
      }
    )
  }

  async login(submittedForm: FormGroup) {

    this.authService
      .login(submittedForm.value.email, submittedForm.value.password)
      .pipe(catchError((err) => (this.loginError = err)))

    combineLatest([this.authService.authStatus$, this.authService.currentUser$])
      .pipe(
        filter(([authStatus, user]) => authStatus.isAuthenticated && user?._id !== ''),
        first(),
        tap(([authStatus, user]) => {
          this.uiService.showToast(
            `Welcome ${user.fullName}! Role: ${authStatus.userRole}`
          )
          this.router.navigate([
            this.redirectUrl || this.homeRoutePerRole(user.role as Role),
          ])
        })
      )
      .subscribe()
  }

  private homeRoutePerRole(role: Role) {
    switch (role) {
      case Role.User:
        return '/dashboard'
      case Role.Admin:
        return '/dashboard'
      default:
        return '/home'
    }
  }

  onSignUp(): void {
    this.router.navigateByUrl('/sign-up')
  }

  goToLogin() {
    this.displayType = 'login';
  }
  goToForgotPassword() {
    this.displayType = 'forgot-password';
  }

  goToChangePassword() {
    this.displayType = 'change-password';


  }

  handleForgotPassword() {
    const forgotPasswordParams = {
      username: this.forgotPassword.get('email')?.value,
    }

    this.ForgotPassword.forgotPassword(forgotPasswordParams).subscribe({
      next: (value) => {
        console.log('value: ', value)

        setTimeout(() => {
          this.goToChangePassword()
        }, 2000);
      },
    })
  }

  handleChangePassword() {
    const changePasswordParams = {
      username: this.changePassword.get('username')?.value,
      confirmationCode: this.changePassword.get('confirmationCode')?.value,
      password: this.changePassword.get('newPassword')?.value,
    }
    this.ChangePassword.changePassword(changePasswordParams).subscribe({
      next: (value) => {
        console.log('value: ', value)
        this.goToLogin();
      },
    })
  }
}
