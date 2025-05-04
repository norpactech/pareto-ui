import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'

import { AuthService } from '../auth/auth.service'
import { LoginComponent } from '../login/login.component'

@Component({
    selector: 'app-home',
    template: `
    @if ((authService.authStatus$ | async)?.isAuthenticated) {
      <div>
        <div class="mat-headline-4">Welcome to The Pareto Factory!</div>
      </div>
    } @else {
      <app-login></app-login>
    }
  `,
    imports: [LoginComponent, AsyncPipe]
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}
