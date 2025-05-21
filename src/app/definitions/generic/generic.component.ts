import { Component } from '@angular/core'
import { MatTabsModule } from '@angular/material/tabs'

import { GenericDataTypeTableComponent } from './generic-data-type/generic-data-type-table.component'
import { GenericDataTypeAttributeTableComponent } from './generic-data-type-attribute/generic-data-type-attribute-table.component'
import { GenericPropertyTypeTableComponent } from './generic-property-type/generic-property-type-table.component'

@Component({
  selector: 'app-platform',
  template: `
    <mat-tab-group>
      <mat-tab label="Data Types">
        <app-generic-data-type-table></app-generic-data-type-table>
      </mat-tab>
      <mat-tab label="Property Types">
        <app-generic-property-type-table></app-generic-property-type-table>
      </mat-tab>
      <mat-tab label="Property Type Attributes">
        <app-generic-data-type-attribute-table></app-generic-data-type-attribute-table>
      </mat-tab>
    </mat-tab-group>
  `,
  imports: [
    MatTabsModule,
    GenericDataTypeTableComponent,
    GenericPropertyTypeTableComponent,
    GenericDataTypeAttributeTableComponent,
  ],
})
export class GenericComponent {}
