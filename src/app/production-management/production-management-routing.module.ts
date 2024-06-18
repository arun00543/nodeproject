import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductionComponent } from './production/add-production/add-production.component';
import { ManageProductionComponent } from './production/manage-production/manage-production.component';
import { ManageProductionStockComponent } from './manage-production-stock/manage-production-stock.component';

const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'add-production',
    pathMatch: 'full'
  }, {
    path:'add-production',
    component:AddProductionComponent
  },
  {
    path:'manage-production',
    component:ManageProductionComponent
  },
  {
    path:'edit-production',
component:AddProductionComponent
  },
  {
    path:'manage-production-stock',
    component:ManageProductionStockComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionManagementRoutingModule { }
