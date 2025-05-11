import { Component } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-navigation-menu',
  styles: `
    .active-link {
      font-weight: bold;
      border-left: 3px solid green;
    }
    .mat-mdc-subheader {
      font-weight: bold;
    }
    mat-nav-list {
      padding: 0 5px; /* Add padding to ensure text is 10px from the edge */
    }
  `,
  template: `
    <mat-nav-list>
      <h3 mat-subheader>Definitions</h3>
      <a mat-list-item routerLinkActive="active-link" routerLink="/definitions/generic">
        Generic
      </a>
      <a
        mat-list-item
        routerLinkActive="active-link"
        routerLink="/definitions/architectural">
        Platform
      </a>
      <a mat-list-item routerLinkActive="active-link" routerLink="/definitions/tables">
        Tables
      </a>

      <h3 mat-subheader>Manager</h3>
      <a mat-list-item routerLinkActive="active-link" routerLink="/manager/users">
        Users
      </a>
    </mat-nav-list>
  `,
  imports: [MatListModule, RouterLinkActive, RouterLink],
})
export class NavigationMenuComponent {}
