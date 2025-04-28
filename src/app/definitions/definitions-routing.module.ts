import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ArchitecturalComponent } from './architectural/architectural.component'
import { GenericComponent } from './generic/generic.component'
import { TablesComponent } from './tables/tables.component'
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfirmationDialogComponent } from '../common/is-active.component'

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
