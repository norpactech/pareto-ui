import { Component } from '@angular/core'
import { MatTabsModule } from '@angular/material/tabs'

import { ContextTableComponent } from './context/context-table.component'
import { ContextDataTypeTableComponent } from './context-data-type/context-data-type-table.component'
import { ContextPropertyTypeTableComponent } from './context-property-type/context-property-type-table.component'

@Component({
  selector: 'app-platform',
  template: `
    <mat-tab-group>
      <mat-tab label="Context">
        <app-context-table></app-context-table>
      </mat-tab>
      <mat-tab label="Data Types">
        <app-context-data-type-table></app-context-data-type-table>
      </mat-tab>
      <mat-tab label="Property Types">
        <app-context-property-type-table></app-context-property-type-table>
      </mat-tab>
    </mat-tab-group>
  `,
  imports: [
    MatTabsModule,
    ContextTableComponent,
    ContextDataTypeTableComponent,
    ContextPropertyTypeTableComponent,
  ],
})
export class PlatformComponent {}
