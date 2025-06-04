import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ComponentComponent } from './component/component.component'
import { ComponentOmitComponent } from './component-omit/component-omit.component'
import { ComponentPropertyComponent } from './component-property/component-property.component'

const routes: Routes = [
  { path: '', component: ComponentComponent },
  { path: 'component', component: ComponentComponent },
  { path: 'component-omit', component: ComponentOmitComponent },
  { path: 'component-property', component: ComponentPropertyComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule { }
