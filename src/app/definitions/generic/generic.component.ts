import { Component } from '@angular/core'
import { MatTabsModule } from '@angular/material/tabs'

import { DataTypeComponent } from './data-type/data-type.component'
import { PropertyTypeComponent } from './property-type/property-type.component'
import { PropertyTypeAttributeComponent } from './property-type-attribute/property-type-attribute.component'

@Component({
  selector: 'app-architectural',
  template: `
    <mat-tab-group>
      <mat-tab label="Data Types">
        <app-data-type></app-data-type>
      </mat-tab>
      <mat-tab label="Property Types">
        <app-property-type></app-property-type>
      </mat-tab>
      <mat-tab label="Property Type Attributes">
        <app-property-type-attribute></app-property-type-attribute>
      </mat-tab>
    </mat-tab-group>
  `,
  standalone: true,
  imports: [
    MatTabsModule,
    DataTypeComponent,
    PropertyTypeComponent,
    PropertyTypeAttributeComponent,
  ],
})
export class GenericComponent {}
