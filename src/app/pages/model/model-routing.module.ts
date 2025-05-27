import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { IndexComponent } from './data-object/index/index.component'
import { IndexPropertyComponent } from './data-object/index-property/index-property.component'
import { PropertyComponent } from './data-object/property/property.component'
import { PropertyTypeComponent } from './data-object/property-type/property-type.component'
import { SchemaComponent } from './schema/schema.component'

const routes: Routes = [
  { path: '', component: SchemaComponent },
  { path: 'schema', component: SchemaComponent },
  { path: 'data-object/property', component: PropertyComponent },
  { path: 'data-object/property-type', component: PropertyTypeComponent },
  { path: 'data-object/index', component: IndexComponent },
  { path: 'data-object/index-property', component: IndexPropertyComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelRoutingModule { }
