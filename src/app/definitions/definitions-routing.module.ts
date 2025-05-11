import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { RouterModule, Routes } from '@angular/router'

import { ConfirmationDialogComponent } from '../common/dialogs/confirmation-dialog.component'
import { ArchitecturalComponent } from './architectural/architectural.component'
import { GenericComponent } from './generic/generic.component'
import { TablesComponent } from './tables/tables.component'

const routes: Routes = [
  { path: '', component: ArchitecturalComponent },
  { path: 'generic', component: GenericComponent },
  { path: 'tables', component: TablesComponent },
  { path: 'architectural', component: ArchitecturalComponent },
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
export class DefinitionsRoutingModule {}
