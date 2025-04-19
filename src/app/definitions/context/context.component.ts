import { Component } from '@angular/core'
import { MatTabsModule } from '@angular/material/tabs'

import { ArchitectureComponent } from './architecture/architecture.component'
import { DataTypeComponent } from './data-type/data-type.component'
import { PropertyTypeComponent } from './property-type/property-type.component'

@Component({
  selector: 'app-context',
  template: `
    <mat-tab-group>
      <mat-tab label="Architecture">
        <app-architecture></app-architecture>
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
    ArchitectureComponent,
    DataTypeComponent,
    PropertyTypeComponent,
  ],
})
export class ContextComponent {}
