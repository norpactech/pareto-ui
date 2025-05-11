import { Routes } from '@angular/router'

import { Role } from './auth/auth.enum'
import { authGuard } from './auth/auth.guard'
import { DashboardComponent } from './home/dashboard.component'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    data: { hideToolbar: false },
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { hideToolbar: false },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canLoad: [authGuard],
    data: {
      expectedRole: Role.Admin,
      hideToolbar: false,
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { hideToolbar: true },
  },
  {
    path: 'login/:redirectUrl',
    component: LoginComponent,
    data: { hideToolbar: true },
  },
  {
    path: 'manager',
    loadChildren: () => import('./manager/manager.module').then((m) => m.ManagerModule),
    canLoad: [authGuard],
    data: {
      expectedRole: Role.Admin,
      hideToolbar: false,
    },
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    data: {
      expectedRole: [Role.User, Role.Admin],
      hideToolbar: false,
    },
  },
  {
    path: 'definitions',
    loadChildren: () =>
      import('./definitions/definitions.module').then((m) => m.DefinitionsModule),
    canLoad: [authGuard],
    data: {
      expectedRole: [Role.User, Role.Admin],
      hideToolbar: false,
    },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
]
