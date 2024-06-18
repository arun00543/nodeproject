import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { ChartComponent } from './chart/chart.component';
import { CustomerChartComponent } from './customer-chart/customer-chart.component';
import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { CrmChartComponent } from './crm-chart/crm-chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProductionChartComponent } from './production-chart/production-chart.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { IgxGeographicMapModule } from "igniteui-angular-maps";
import { IgxDataChartInteractivityModule } from "igniteui-angular-charts";
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';
import { ExpenseChartComponent } from './expense-chart/expense-chart.component';


@NgModule({
  declarations: [
    ChartComponent,
    CustomerChartComponent,
    SalesChartComponent,
    CrmChartComponent,
    ProductionChartComponent,
    ExpenseChartComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    IgxGeographicMapModule,
    IgxDataChartInteractivityModule,
    IndCurrencyFormat
  ]
})
export class AnalyticsModule { }
