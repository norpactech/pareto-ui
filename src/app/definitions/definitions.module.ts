import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { DefinitionsRoutingModule } from './definitions-routing.module'
import { GenericComponent } from './generic/generic.component'
import { PlatformComponent } from './platform/platform.component'
import { TablesComponent } from './tables/tables.component'
@NgModule({
  imports: [
    CommonModule,
    GenericComponent,
    PlatformComponent,
    TablesComponent,
    DefinitionsRoutingModule,
  ],
})
export class DefinitionsModule {}
