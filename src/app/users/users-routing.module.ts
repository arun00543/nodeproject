import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddCustomerComponent } from './customer-management/add-customer/add-customer.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { ManageUserComponent } from './user-management/manage-user/manage-user.component';
import { ManageCustomerComponent } from './customer-management/manage-customer/manage-customer.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { CustomerSalesorderComponent } from './customer-management/customer-salesorder/customer-salesorder.component';
import { AddCustomerWalletComponent } from './customer-wallet/add-customer-wallet/add-customer-wallet.component';
import { ManageCustomerWalletComponent } from './customer-wallet/manage-customer-wallet/manage-customer-wallet.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: "dashboard", component: DashboardComponent },
     // user
  {
    path: 'add-user',
    component: AddUserComponent
  },
  {
    path: 'edit-user',
    component: AddUserComponent
  },
  {
    path: 'manage-user',
    component: ManageUserComponent
  },
     // customer
  {
    path: 'add-customer',
    component: AddCustomerComponent
  },
  {
    path: 'edit-customer',
    component: AddCustomerComponent
  },
  {
    path: 'manage-customer',
    component: ManageCustomerComponent
  },
  {
    path: 'user-profile',
    component: UserProfileComponent
  },
  {
    path: 'customer-salesorder',
    component: CustomerSalesorderComponent
  },
  {
    path: 'add-customer-wallet',
    component: AddCustomerWalletComponent
  },
  {
    path: 'manage-customer-wallet',
    component: ManageCustomerWalletComponent
  },
  {
    path: 'edit-customer-wallet',
    component: AddCustomerWalletComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
