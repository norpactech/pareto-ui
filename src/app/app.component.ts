import { AsyncPipe } from '@angular/common'
import { NgOptimizedImage } from '@angular/common'
import { Component, DestroyRef, inject, OnInit } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { DomSanitizer } from '@angular/platform-browser'
import { RouterLink, RouterOutlet } from '@angular/router'
import { FlexLayoutModule, MediaObserver } from '@ngbracket/ngx-layout'
import { combineLatest } from 'rxjs'
import { tap } from 'rxjs/operators'

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
      align-items: center; /* Vertically center items */
      justify-content: space-between; /* Distribute space between items */
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
          color="primary"
          fxLayoutGap="8px"
          class="app-toolbar"
          [class.app-is-mobile]="media.isActive('xs')">
          @if (auth?.status?.isAuthenticated) {
            <button mat-icon-button (click)="sidenav.toggle()">
              <mat-icon>menu</mat-icon>
            </button>
          }
          <a routerLink="/home" class="logo-link">
            <img src="assets/img/icons/norpac.png" alt="NorPacTech Icon" class="logo" />
            <span class="left-pad modern-font">Pareto Factory</span>
          </a>
          <span class="flex-spacer"></span>
          @if (auth?.status?.isAuthenticated) {
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
  ],
})
export class AppComponent implements OnInit {
  currentYear: number = new Date().getFullYear()
  private readonly destroyRef = inject(DestroyRef)
  opened!: boolean

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public authService: AuthService,
    public media: MediaObserver
  ) {
    iconRegistry.addSvgIcon(
      'norpac',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/norpac.png')
    )
  }

  ngOnInit() {
    combineLatest([this.media.asObservable(), this.authService.authStatus$])
      .pipe(
        tap(([mediaValue, authStatus]) => {
          if (!authStatus?.isAuthenticated) {
            this.opened = false
          } else {
            if (mediaValue[0].mqAlias === 'xs') {
              this.opened = false
            } else {
              this.opened = true
            }
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe()
  }
}
