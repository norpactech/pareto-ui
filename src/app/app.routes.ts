import { Routes } from '@angular/router'

import { Role } from './auth/auth.enum'
import { authGuard } from './auth/auth.guard'
import { LoginComponent } from './auth/pages/login/login.component'
import { SignUpComponent } from './auth/pages/sign-up/sign-up.component'
import { DashboardComponent } from './home/dashboard.component'
import { HomeComponent } from './home/home.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
    path: 'sign-up',
    component: SignUpComponent,
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
    path: 'project',
    loadChildren: () =>
      import('./pages/project/project.module').then((m) => m.ProjectModule),
    canLoad: [authGuard],
    data: {
      expectedRole: [Role.User, Role.Admin],
      hideToolbar: false,
    },
  },
  {
    path: 'model',
    loadChildren: () => import('./pages/model/model.module').then((m) => m.ModelModule),
    canLoad: [authGuard],
    data: {
      expectedRole: [Role.User, Role.Admin],
      hideToolbar: false,
    },
  },
  {
    path: 'system',
    loadChildren: () =>
      import('./pages/system/system.module').then((m) => m.SystemModule),
    canLoad: [authGuard],
    data: {
      expectedRole: [Role.User, Role.Admin],
      hideToolbar: false,
    },
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./pages/account/account.module').then((m) => m.AccountModule),
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
