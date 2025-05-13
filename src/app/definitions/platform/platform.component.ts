import { Component } from '@angular/core'
import { MatTabsModule } from '@angular/material/tabs'

import { ContextTableComponent } from './context/context-table.component'
import { ContextDataTypeTableComponent } from './context-data-type/context-data-type-table.component'
import { ContextPropertyTypeComponent } from './context-property-type/context-property-type.component'

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
        <app-context-property-type></app-context-property-type>
      </mat-tab>
    </mat-tab-group>
  `,
  imports: [
    MatTabsModule,
    ContextTableComponent,
    ContextDataTypeTableComponent,
    ContextPropertyTypeComponent,
  ],
})
export class PlatformComponent {}
