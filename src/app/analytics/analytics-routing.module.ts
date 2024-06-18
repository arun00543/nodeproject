import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { CustomerChartComponent } from './customer-chart/customer-chart.component';
import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { CrmChartComponent } from './crm-chart/crm-chart.component';
import { ProductionChartComponent } from './production-chart/production-chart.component';
import { ExpenseChartComponent } from './expense-chart/expense-chart.component';

const routes: Routes = [
   {
    path: 'chart',
    component: ChartComponent
  },
  {
    path: 'order-sales-chart',
    component: SalesChartComponent
  },
  {
    path: 'customer-chart',
    component: CustomerChartComponent
  },
  {
    path: 'crm-chart',
    component: CrmChartComponent
  },
  {
    path: 'production-chart',
    component: ProductionChartComponent
  },
  {
    path: 'expense-chart',
    component: ExpenseChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
