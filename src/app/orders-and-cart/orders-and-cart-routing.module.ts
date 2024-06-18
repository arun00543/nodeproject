import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { PendingOrdersComponent } from './pending-orders/pending-orders.component';
import { ApproveOrderComponent } from './approve-order/approve-order.component';
import { AdminCartComponent } from './admin-cart/admin-cart.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products-list',
    pathMatch: 'full'
  },
  {
    path: 'products-list',
    component: ProductListComponent
  },
  {
    path: 'admin-cart',
    component: AdminCartComponent
  },
  {
    path: 'pending-orders',
    component: PendingOrdersComponent
    },
    {
    path: 'my-orders',
    component: MyOrdersComponent
  },
  {
    path: 'approve-orders',
    component: ApproveOrderComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersAndCartRoutingModule { }
