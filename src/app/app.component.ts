import { AsyncPipe, CommonModule, NgIf, NgOptimizedImage } from '@angular/common'
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
import { SideNavigationMenuModule } from './manager/side-navigation-menu/side-navigation-menu.module'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    FlexLayoutModule,
    RouterLink,
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
    SideNavigationMenuModule,
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
