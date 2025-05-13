import { Component } from '@angular/core'
import { MatTabsModule } from '@angular/material/tabs'

import { GenericDataTypeComponent } from './generic-data-type/generic-data-type.component'
import { GenericPropertyTypeComponent } from './generic-property-type/generic-property-type.component'
import { PropertyTypeAttributeComponent } from './property-type-attribute/property-type-attribute.component'

@Component({
  selector: 'app-platform',
  template: `
    <mat-tab-group>
      <mat-tab label="Data Types">
        <app-generic-data-type></app-generic-data-type>
      </mat-tab>
      <mat-tab label="Property Types">
        <app-generic-property-type></app-generic-property-type>
      </mat-tab>
      <mat-tab label="Property Type Attributes">
        <app-property-type-attribute></app-property-type-attribute>
      </mat-tab>
    </mat-tab-group>
  `,
  imports: [
    MatTabsModule,
    GenericDataTypeComponent,
    GenericPropertyTypeComponent,
    PropertyTypeAttributeComponent,
  ],
})
export class GenericComponent {}
