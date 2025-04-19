import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefinitionsRoutingModule {}
