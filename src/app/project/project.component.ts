import { CommonModule } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MatTabsModule } from '@angular/material/tabs'

@Component({
  selector: 'app-project',
  template: `
    <mat-tab-nav-bar>
      <a mat-tab-link routerLink="/tab1" routerLinkActive="active">Tab 1</a>
      <a mat-tab-link routerLink="/tab2" routerLinkActive="active">Tab 2</a>
    </mat-tab-nav-bar>
  `,
  standalone: true,
  imports: [MatTabsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProjectComponent {}
