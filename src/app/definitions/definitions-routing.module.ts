import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { RouterModule, Routes } from '@angular/router'

import { ConfirmationDialogComponent } from '../common/dialogs/confirmation-dialog.component'
import { GenericComponent } from './generic/generic.component'
import { PlatformComponent } from './platform/platform.component'
import { TablesComponent } from './tables/tables.component'

const routes: Routes = [
  { path: '', component: PlatformComponent },
  { path: 'generic', component: GenericComponent },
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
export class DefinitionsRoutingModule {}
