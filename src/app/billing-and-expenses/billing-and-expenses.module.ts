import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingAndExpensesRoutingModule } from './billing-and-expenses-routing.module';
import { ManageSalesOrderComponent } from './manage-sales-order/manage-sales-order.component';

// import { DataTablesModule } from 'angular-datatables/src/angular-datatables.module';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatNativeDateModule } from '@angular/material/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UpdatePaymentComponent } from './payments/update-payment/update-payment.component';
import { ManagePaymentComponent } from './payments/manage-payment/manage-payment.component';
import { PaymentStatusComponent } from './payments/payment-status/payment-status.component';
import { AddPaymentTypeComponent } from './payments/payment-type/add-payment-type/add-payment-type.component';
import { ManagePaymentTypeComponent } from './payments/payment-type/manage-payment-type/manage-payment-type.component';
import { CreditPaymentTrackerComponent } from './payments/credit-payment-tracker/credit-payment-tracker.component';
import { SalesOrderStatusComponent } from './sales-order-status/sales-order-status.component';
import { CreatePayrollComponent } from './payroll/create-payroll/create-payroll.component';
import { ManagePayrollComponent } from './payroll/manage-payroll/manage-payroll.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AddExpenseComponent } from './expense management/expense/add-expense/add-expense.component';
import { ManageExpenseComponent } from './expense management/expense/manage-expense/manage-expense.component';
import { AddExpenceCategoryComponent } from './expense management/expence category/add-expence-category/add-expence-category.component';
import { ManageExpenceCategoryComponent } from './expense management/expence category/manage-expence-category/manage-expence-category.component';
import { WalletHistoryComponent } from './payments/wallet-history/wallet-history.component';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';

@NgModule({
  declarations: [
    ManageSalesOrderComponent,
    UpdatePaymentComponent,
    ManagePaymentComponent,
    PaymentStatusComponent,
    AddPaymentTypeComponent,
    ManagePaymentTypeComponent,
    CreditPaymentTrackerComponent,
    SalesOrderStatusComponent,
    CreatePayrollComponent,
    ManagePayrollComponent,
    AddExpenseComponent,
    ManageExpenseComponent,
    AddExpenceCategoryComponent,
    ManageExpenceCategoryComponent,
    WalletHistoryComponent
  ],
  imports: [
    CommonModule,
    BillingAndExpensesRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule ,
    FormsModule,
MatRadioModule,
MatSelectModule ,
MatSidenavModule ,
MatSlideToggleModule ,
 MatSliderModule ,
MatSortModule ,
MatStepperModule ,
MatToolbarModule,
MatTooltipModule,
MatCardModule,
MatTabsModule,
MatTableModule,
MatProgressSpinnerModule,
MatPaginatorModule,
MatTableExporterModule,
IndCurrencyFormat
  ]
})
export class BillingAndExpensesModule { }
