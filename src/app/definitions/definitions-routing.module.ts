import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ContextComponent } from './context/context.component'
import { DefinitionsComponent } from './definitions.component'
import { GenericComponent } from './generic/generic.component'
import { TablesComponent } from './tables/tables.component'

const routes: Routes = [
  {
    path: '',
    component: DefinitionsComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'generic', component: GenericComponent },
      { path: 'tables', component: TablesComponent },
      { path: 'context', component: ContextComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefinitionsRoutingModule {}
