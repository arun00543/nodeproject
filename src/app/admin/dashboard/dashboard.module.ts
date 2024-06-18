import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SuperDashboardComponent } from './super-dashboard/super-dashboard.component';
import { NgxSpinnerModule } from "ngx-spinner";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';


@NgModule({
  declarations: [
    DashboardComponent,
    SuperDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatIconModule,
    MatToolbarModule,
    NgxSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    FormsModule,
    MatTabsModule,
    IndCurrencyFormat
  ]
})
export class DashboardModule { }
