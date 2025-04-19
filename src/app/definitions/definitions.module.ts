import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { ContextComponent } from './context/context.component'
import { DefinitionsRoutingModule } from './definitions-routing.module'
import { GenericComponent } from './generic/generic.component'
import { TablesComponent } from './tables/tables.component'

@NgModule({
  imports: [
    CommonModule,
    GenericComponent,
    ContextComponent,
    TablesComponent,
    DefinitionsRoutingModule,
  ],
})
export class DefinitionsModule {}
