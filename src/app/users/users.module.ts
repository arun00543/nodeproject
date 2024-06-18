import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';

import { AddCustomerComponent } from './customer-management/add-customer/add-customer.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { ManageUserComponent } from './user-management/manage-user/manage-user.component';
import { ManageCustomerComponent } from './customer-management/manage-customer/manage-customer.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { CustomerSalesorderComponent } from './customer-management/customer-salesorder/customer-salesorder.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AddCustomerWalletComponent } from './customer-wallet/add-customer-wallet/add-customer-wallet.component';
import { ManageCustomerWalletComponent } from './customer-wallet/manage-customer-wallet/manage-customer-wallet.component';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';


@NgModule({
  declarations: [
    DashboardComponent,
    AddUserComponent,
    ManageUserComponent,
    AddCustomerComponent,
    ManageCustomerComponent,
    UserProfileComponent,
    CustomerSalesorderComponent,
    AddCustomerWalletComponent,
    ManageCustomerWalletComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
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
],

})
export class UsersModule { }
