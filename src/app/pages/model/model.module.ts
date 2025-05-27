import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelRoutingModule } from './model-routing.module';
import { SchemaComponent } from './schema/schema.component';
import { PropertyComponent } from './data-object/property/property.component';
import { PropertyTypeComponent } from './data-object/property-type/property-type.component';
import { IndexComponent } from './data-object/index/index.component';
import { IndexPropertyComponent } from './data-object/index-property/index-property.component';


@NgModule({
  declarations: [
    SchemaComponent,
    PropertyComponent,
    PropertyTypeComponent,
    IndexComponent,
    IndexPropertyComponent
  ],
  imports: [
    CommonModule,
    ModelRoutingModule
  ]
})
export class ModelModule { }
