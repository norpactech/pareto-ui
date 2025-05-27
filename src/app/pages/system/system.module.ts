import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { ReferenceTableTypeComponent } from './reference-table-type/reference-table-type.component';
import { ReferenceTableComponent } from './reference-table/reference-table.component';
import { ValidatorsComponent } from './validators/validators.component';
import { PluginComponent } from './plugin/plugin.component';


@NgModule({
  declarations: [
    ReferenceTableTypeComponent,
    ReferenceTableComponent,
    ValidatorsComponent,
    PluginComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule
  ]
})
export class SystemModule { }
