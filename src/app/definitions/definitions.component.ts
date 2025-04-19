import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-definitions',
  styles: `
      .active-link {
        font-weight: bold;
        border-bottom: 2px solid #005005;
      }
  `,
  template: `
    <mat-toolbar color="accent" fxLayoutGap="8px">
      <a mat-button routerLink="context" routerLinkActive="active-link"> Context </a>
      <a mat-button routerLink="generic" routerLinkActive="active-link"> Generics </a>
      <a mat-button routerLink="tables" routerLinkActive="active-link"> Tables </a>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
})
export class DefinitionsComponent {}
