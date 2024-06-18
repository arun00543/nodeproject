import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebLayoutRoutingModule } from './web-layout-routing.module';
import { WebLayoutComponent } from './web-layout.component';
import { WebAppModule } from 'app/web/web-app.module';


@NgModule({
  declarations: [
    WebLayoutComponent
  ],
  imports: [
    CommonModule,
    WebLayoutRoutingModule,
    WebAppModule,
  ]
})
export class WebLayoutModule { }
