import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { RouterModule, Routes } from '@angular/router'

import { ConfirmationDialogComponent } from '../common/dialogs/confirmation-dialog.component'
import { GenericComponent } from './generic/generic.component'
import { GenericDataTypeTableComponent } from './generic/generic-data-type/generic-data-type-table.component'
import { GenericDataTypeAttributeTableComponent } from './generic/generic-data-type-attribute/generic-data-type-attribute-table.component'
import { GenericPropertyTypeTableComponent } from './generic/generic-property-type/generic-property-type-table.component'
import { PlatformComponent } from './platform/platform.component'
import { TablesComponent } from './tables/tables.component'

const routes: Routes = [
  { path: '', component: PlatformComponent },
  { path: 'generic', component: GenericComponent },
  { path: 'generic/data-types', component: GenericDataTypeTableComponent },
  { path: 'generic/property-types', component: GenericDataTypeAttributeTableComponent },
  {
    path: 'generic/property-type-attributes',
    component: GenericPropertyTypeTableComponent,
  },
  { path: 'tables', component: TablesComponent },
  { path: 'platform', component: PlatformComponent },
]

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  exports: [RouterModule, ConfirmationDialogComponent],
})
export class DefinitionsRoutingModule { }
