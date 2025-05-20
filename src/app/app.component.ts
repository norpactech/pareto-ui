import { AsyncPipe, CommonModule } from '@angular/common'
import { NgIf, NgOptimizedImage } from '@angular/common'
import { Component, DestroyRef, inject, OnInit } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { DomSanitizer } from '@angular/platform-browser'
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router'
import { ITenant } from '@app/core/model'
import { TenantService } from '@core/service'
import { TenantStateService } from '@core/state/tenant-state.service'
import { FlexLayoutModule, MediaObserver } from '@ngbracket/ngx-layout'
import { combineLatest } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'

import { AuthService } from './auth/auth.service'
import { LoadingOverlayComponent } from './common/loading-overlay.component'
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component'

@Component({
  selector: 'app-root',
  styles: `
    .app-container {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .app-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .left-pad {
      display: inline-block;
      vertical-align: middle;
      transform: translateY(2px);
      margin-left: 8px;
    }
    .logo {
      height: 40px;
      width: 40px;
      vertical-align: middle;
      margin-right: 8px;
    }
    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: black;
    }

    .sign-in-button {
      border: 1px solid #d0d7de;
      color: #24292f;
      background-color: #f6f8fa;
      text-transform: none;
      font-weight: 500;
      padding: 6px 16px;
      border-radius: 6px;
    }

    .sign-in-button:hover {
      background-color: #e1e4e8; /* Light gray hover background */
      color: #4caf50; /* Green 500 */
    }
    .flex-spacer {
      flex: 1 1 auto;
    }

    .tenant-label {
      margin-right: 8px;
      font-weight: 500;
    }
    .tenant-select {
      height: 36px;
      min-width: 180px;
      border-radius: 4px;
      border: 1px solid #ccc;
      padding: 0 8px;
      font-size: 1rem;
      vertical-align: middle;
    }
    .logo-link:hover {
      color: black;
    }
    .app-sidenav-container {
      flex: 1;
      padding-right: 10px;
    }
    .app-is-mobile .app-sidenav-container {
      flex: 1 0 auto;
    }
    mat-sidenav {
      width: 200px;
    }
    .mat-sidenav-content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .main-content {
      flex: 1;
      padding: 16px;
    }

    .image-cropper {
      border-radius: 50%;
    }
    .modern-font {
      font-family: 'Bebas Neue', sans-serif;
      font-weight: 400; /* Bebas Neue only supports one weight */
      letter-spacing: 2px; /* Add spacing for a bold industrial feel */
      text-transform: uppercase; /* Optional: Make the text uppercase for a stronger look */
      font-size: 2rem; /* Increase the font size to make the text taller */
      line-height: 1.2; /* Adjust line height for better spacing */
    }
    footer {
      text-align: center;
      padding: 16px;
      background-color: #f5f5f5;
      border-top: 1px solid #ddd;
      font-size: 0.9rem;
      color: #666;
    }
    footer img {
      margin-right: 8px; /* Center the image and add spacing below it */
      height: 20px; /* Set a fixed height for the image */
    }
  `,
  template: `
    <app-loading-overlay></app-loading-overlay>
    <div class="app-container">
      @if (
        {
          status: authService.authStatus$ | async,
          user: authService.currentUser$ | async,
        };
        as auth
      ) {
        <mat-toolbar
          *ngIf="showToolbar"
          color="primary"
          fxLayoutGap="8px"
          class="app-toolbar"
          [class.app-is-mobile]="media.isActive('xs')">
          @if (auth?.status?.isAuthenticated) {
            <button mat-icon-button (click)="sidenav.toggle()">
              <mat-icon>menu</mat-icon>
            </button>
          }
          <a routerLink="/dashboard" class="logo-link">
            <img src="assets/img/icons/norpac.png" alt="NorPacTech Icon" class="logo" />
            <span class="left-pad modern-font">Pareto Factory</span>
          </a>
          <span class="flex-spacer"></span>
          @if (auth?.status?.isAuthenticated) {
            <div>
              <span class="tenant-label ">Tenant:</span>
              <select
                class="tenant-select"
                [(ngModel)]="selectedIdTenant"
                (change)="onTenantChange($event)">
                <option *ngFor="let tenant of tenants" [value]="tenant.id">
                  {{ tenant.name }}
                </option>
              </select>
            </div>
            <span class="flex-spacer"></span>
            <button
              mat-mini-fab
              routerLink="/user/profile"
              matTooltip="Profile"
              aria-label="User Profile">
              @if (auth?.user?.picture) {
                <img
                  alt="Profile picture"
                  class="image-cropper"
                  [ngSrc]="auth.user?.picture ?? ''"
                  width="40px"
                  height="40px"
                  fill />
              } @else {
                <mat-icon>account_circle</mat-icon>
              }
            </button>
            <button
              mat-mini-fab
              routerLink="/user/logout"
              matTooltip="Logout"
              aria-label="Logout">
              <mat-icon>lock_open</mat-icon>
            </button>
          } @else {
            <div class="auth-buttons">
              <button
                mat-stroked-button
                class="sign-in-button"
                routerLink="/login"
                matTooltip="Sign In"
                aria-label="Sign In">
                Sign In
              </button>
              <button
                mat-stroked-button
                class="sign-in-button"
                routerLink="/login"
                matTooltip="Sign Up"
                aria-label="Sign Up">
                Sign Up
              </button>
            </div>
          }
        </mat-toolbar>
      }
      <mat-sidenav-container class="app-sidenav-container">
        <mat-sidenav
          #sidenav
          [mode]="media.isActive('xs') ? 'over' : 'side'"
          [fixedInViewport]="media.isActive('xs')"
          fixedTopGap="56"
          [(opened)]="opened">
          <app-navigation-menu></app-navigation-menu>
        </mat-sidenav>
        <mat-sidenav-content>
          <div class="main-content">
            <router-outlet></router-outlet>
          </div>
          <footer>
            &copy; {{ currentYear }} Northern Pacific Technologies, LLC. All rights
            reserved. <br /><i>Be Consistent!</i>
          </footer>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  imports: [
    FlexLayoutModule,
    RouterLink,
    NavigationMenuComponent,
    RouterOutlet,
    AsyncPipe,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    NgOptimizedImage,
    LoadingOverlayComponent,
    NgIf,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
  ],
})
export class AppComponent implements OnInit {
  currentYear: number = new Date().getFullYear()
  private readonly destroyRef = inject(DestroyRef)
  opened!: boolean
  showToolbar = true

  tenants = [{ id: '', name: '' }]
  selectedIdTenant: string = this.tenants[0]?.id ?? ''

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public tenantService: TenantService,
    public tenantStateService: TenantStateService,
    public authService: AuthService,
    public media: MediaObserver,
    private router: Router, // Inject Router
    private activatedRoute: ActivatedRoute // Inject ActivatedRoute
  ) {
    iconRegistry.addSvgIcon(
      'norpac',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/norpac.png')
    )
  }

  initTenant() {
    const params = {
      sortColumn: 'name',
      sortDirection: 'asc',
      isActive: true,
    }
    return this.tenantService.find(params).subscribe({
      next: (response) => {
        console.log('Fetching tenants with params:', params)
        this.tenants = response.data.map((tenant: ITenant) => ({
          id: tenant.id,
          name: tenant.name,
        }))
        if (this.tenants.length > 0) {
          this.selectedIdTenant = this.tenants[0].id
          const tenant = this.tenants.find((t) => t.id === this.selectedIdTenant)
          if (tenant) {
            this.tenantStateService.setTenant(tenant)
          }
        }
      },
      error: (err) => {
        console.error('Error during search:', err)
      },
    })
  }
  onTenantChange(event: Event) {
    const idTenant = (event.target as HTMLSelectElement).value
    const tenant = this.tenants.find((t) => t.id === idTenant)
    if (tenant) {
      this.tenantStateService.setTenant(tenant)
    }
  }

  ngOnInit() {
    this.initTenant()

    combineLatest([this.media.asObservable(), this.authService.authStatus$])
      .pipe(
        tap(([mediaValue, authStatus]) => {
          if (!authStatus?.isAuthenticated) {
            this.opened = false
          } else {
            this.opened = mediaValue[0].mqAlias !== 'xs'
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe()

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute
          while (route.firstChild) {
            route = route.firstChild
          }
          return route.snapshot.data['hideToolbar'] ?? false
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (hideToolbar) => {
          this.showToolbar = !hideToolbar
        },
        error: (err) => {
          console.error('Error in Router events:', err)
        },
      })
  }
}
