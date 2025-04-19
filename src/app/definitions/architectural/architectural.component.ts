import { Component } from '@angular/core'
import { MatTabsModule } from '@angular/material/tabs'

import { ContextTableComponent } from './context/context-table.component'
import { DataTypeComponent } from './data-type/data-type.component'
import { PropertyTypeComponent } from './property-type/property-type.component'

@Component({
  selector: 'app-architectural',
  template: `
    <mat-tab-group>
      <mat-tab label="Context">
        <app-context-table></app-context-table>
      </mat-tab>
      <mat-tab label="Data Types">
        <app-data-type></app-data-type>
      </mat-tab>
      <mat-tab label="Property Types">
        <app-property-type></app-property-type>
      </mat-tab>
    </mat-tab-group>
  `,
  standalone: true,
  imports: [
    MatTabsModule,
    ContextTableComponent,
    DataTypeComponent,
    PropertyTypeComponent,
  ],
})
export class ArchitecturalComponent {}
