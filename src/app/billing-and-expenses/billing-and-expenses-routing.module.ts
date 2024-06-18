
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePaymentComponent } from './payments/manage-payment/manage-payment.component';
import { UpdatePaymentComponent } from './payments/update-payment/update-payment.component';
import { ManageSalesOrderComponent } from './manage-sales-order/manage-sales-order.component';
import { PaymentStatusComponent } from './payments/payment-status/payment-status.component';
import { AddPaymentTypeComponent } from './payments/payment-type/add-payment-type/add-payment-type.component';
import { ManagePaymentTypeComponent } from './payments/payment-type/manage-payment-type/manage-payment-type.component';
import { CreditPaymentTrackerComponent } from './payments/credit-payment-tracker/credit-payment-tracker.component';
import { CreatePayrollComponent } from './payroll/create-payroll/create-payroll.component';
import { ManagePayrollComponent } from './payroll/manage-payroll/manage-payroll.component';
import { ManageExpenseComponent } from './expense management/expense/manage-expense/manage-expense.component';
import { AddExpenseComponent } from './expense management/expense/add-expense/add-expense.component';
import { AddExpenceCategoryComponent } from './expense management/expence category/add-expence-category/add-expence-category.component';
import { ManageExpenceCategoryComponent } from './expense management/expence category/manage-expence-category/manage-expence-category.component';
import { WalletHistoryComponent } from './payments/wallet-history/wallet-history.component';
// import { SalesOrderStatusComponent } from './sales-order-status/sales-order-status.component';


const routes: Routes = [

  {
    path: 'sales-order-status',
    // component:SalesOrderStatusComponent
  },
  {
    path: 'sales-details',
    component: ManageSalesOrderComponent
  },
  {
    path: 'payment-status',
    component: PaymentStatusComponent
  },
  // payment
  {
    path: 'update-payment',
    component: UpdatePaymentComponent
  },
  {
    path: 'edit-payment',
    component: UpdatePaymentComponent
  },
  {
    path: 'manage-payment',
    component: ManagePaymentComponent
  },

  {
    path: 'add-paymentType',
    component: AddPaymentTypeComponent
  },

  {
    path: 'edit-paymentType',
    component: AddPaymentTypeComponent
  },

  {
    path: 'manage-payment-type',
    component: ManagePaymentTypeComponent
  },
  {
    path : 'credit-payment-tracker',
    component: CreditPaymentTrackerComponent
  },
  {
    path : 'create-payroll',
    component: CreatePayrollComponent
  },
  {
    path : 'manage-payroll',
    component: ManagePayrollComponent,
  },
  {
    path: 'edit-payroll',
    component: CreatePayrollComponent
  },
   // expense
   {
    path: 'add-expense',
    component: AddExpenseComponent
  },
  {
    path: 'edit-expense',
    component: AddExpenseComponent
  },
  {
    path: 'manage-expense',
    component: ManageExpenseComponent
  },
     // expense category
     {
      path: 'add-expense-category',
      component: AddExpenceCategoryComponent
    },
    {
      path: 'edit-expense-category',
      component: AddExpenceCategoryComponent
    },
    {
      path: 'manage-expense-category',
      component: ManageExpenceCategoryComponent
    },
    {
      path: 'wallet-history',
      component: WalletHistoryComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingAndExpensesRoutingModule { }
