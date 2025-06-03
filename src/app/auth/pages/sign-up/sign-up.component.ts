import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthMode, Role } from '@app/auth/auth.enum'
// import { AuthService } from '@app/auth/auth.service' //to do for signup functionality
import { UiService } from '@app/common/ui.service'
import { EmailValidation, PasswordValidation } from '@app/common/validations'
import { FieldErrorDirective } from '@app/user-controls/field-error/field-error.directive'
import { environment } from '@environment/environment'
import { FlexModule } from '@ngbracket/ngx-layout'

// import { SignUpService } from './service/sign-up.service' //to do for signup functionality

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
  ],
})
export class SignUpComponent {
  private readonly formBuilder = inject(FormBuilder)
  // private readonly signUpAuthService = inject(SignUpService) //to do for signup functionality
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly uiService = inject(UiService)

  loginForm!: FormGroup
  loginError = ''
  roles = Object.keys(Role)
  authMode = environment.authMode
  AuthMode = AuthMode

  get redirectUrl() {
    return this.route.snapshot.queryParamMap.get('redirectUrl') || ''
  }

  ngOnInit() {
    // this.signUpAuthService.signUp() //to do for signup functionality
    this.buildLoginForm()
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', EmailValidation],
      password: ['', PasswordValidation],
      repeatPassword: [''],
    })
  }

  // this code will be remove used as reference//

  // async login(submittedForm: FormGroup) {
  //   this.signUpAuthService
  //     .login(submittedForm.value.email, submittedForm.value.password)
  //     .pipe(catchError((err) => (this.loginError = err)))

  //   combineLatest([this.signUpAuthService.authStatus$, this.signUpAuthService.currentUser$])
  //     .pipe(
  //       filter(([authStatus, user]) => authStatus.isAuthenticated && user?._id !== ''),
  //       first(),
  //       tap(([authStatus, user]) => {
  //         this.uiService.showToast(
  //           `Welcome ${user.fullName}! Role: ${authStatus.userRole}`
  //         )
  //         this.router.navigate([
  //           this.redirectUrl || this.homeRoutePerRole(user.role as Role),
  //         ])
  //       })
  //     )
  //     .subscribe()
  // }

  // to continue and make it work the signup
  // async signUp(submittedForm: FormGroup) {
  //   this.signUpAuthService
  //     .signUp(
  //       submittedForm.value.email,
  //       submittedForm.value.password,
  //       submittedForm.value.repeatPassword
  //     )
  //     .pipe(catchError((err) => (this.loginError = err)))

  //   combineLatest([
  //     this.signUpAuthService.authStatus$,
  //     this.signUpAuthService.currentUser$,
  //   ])
  //     .pipe(
  //       filter(([authStatus, user]) => authStatus.isAuthenticated && user?._id !== ''),
  //       first(),
  //       tap(([authStatus, user]) => {
  //         this.uiService.showToast(
  //           `Welcome ${user.fullName}! Role: ${authStatus.userRole}`
  //         )
  //         this.router.navigate([
  //           this.redirectUrl || this.homeRoutePerRole(user.role as Role),
  //         ])
  //       })
  //     )
  //     .subscribe()
  // }

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

  goToLogin(): void {
    this.router.navigateByUrl('/login')
  }
}
