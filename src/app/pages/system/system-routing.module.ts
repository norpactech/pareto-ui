import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { PluginComponent } from './plugin/plugin.component'
import { ReferenceTableComponent } from './reference-table/reference-table.component'
import { ReferenceTableTypeComponent } from './reference-table-type/reference-table-type.component'
import { ValidatorsComponent } from './validators/validators.component'

const routes: Routes = [
  { path: '', component: PluginComponent },
  { path: 'reference-table-type', component: ReferenceTableTypeComponent },
  { path: 'reference-table', component: ReferenceTableComponent },
  { path: 'validators', component: ValidatorsComponent },
  { path: 'plugin', component: PluginComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule { }
