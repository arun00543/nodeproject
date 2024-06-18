import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatNativeDateModule } from "@angular/material/core";

import { EmployeeManagementRoutingModule } from "./employee-management-routing.module";
import { ManageEmployeeComponent } from "./employee/manage-employee/manage-employee.component";
import { AddEmployeeComponent } from "./employee/add-employee/add-employee.component";
import { AddDailyStatusComponent_U } from "./daily-status/add-daily-status-u/add-daily-status-u.component";
import { ManageDailyStatusComponent_U } from "./daily-status/manage-daily-status-u/manage-daily-status-u.component";
import { AddLeaveRequestComponent_U } from "./leave-request/add-leave-request/add-leave-request.component";
import { ManageLeaveRequestComponent_U } from "./leave-request/manage-leave-request/manage-leave-request.component";
import { DashboardComponent } from "./dashboard/dashboard/dashboard.component";
import { MatTableExporterModule } from "mat-table-exporter";
import {MatChipsModule} from '@angular/material/chips';
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { AddContractorComponent } from './contractor/add-contractor/add-contractor.component';
import { ManageContractorComponent } from './contractor/manage-contractor/manage-contractor.component';
import { AddContractComponent } from './assign-contractor/add-contract/add-contract.component';
import { ManageContractComponent } from './assign-contractor/manage-contract/manage-contract.component';
import { AddSwipeEntryComponent } from './swipe-entry/add-swipe-entry/add-swipe-entry.component';
import { ManageSwipeEntryComponent } from './swipe-entry/manage-swipe-entry/manage-swipe-entry.component';
import { AddContractorPaymentComponent } from './contractor-payment/add-contractor-payment/add-contractor-payment.component';
import { ManageContractorPaymentComponent } from "./contractor-payment/manage-contractor-payment/manage-contractor-payment.component";
import { AddContractEmployeeComponent } from './contract-employee/add-contract-employee/add-contract-employee.component';
import { ManageContractEmployeeComponent } from './contract-employee/manage-contract-employee/manage-contract-employee.component';
import { AddEmployeePayHoursComponent } from './employee-pay-hours/add-employee-pay-hours/add-employee-pay-hours.component';
import { ManageEmployeePayHoursComponent } from './employee-pay-hours/manage-employee-pay-hours/manage-employee-pay-hours.component';
import { AddEmployeeWeeklyWagesComponent } from './employee-weekly-wages/add-employee-weekly-wages/add-employee-weekly-wages.component';
import { ManageEmployeeWeeklyWagesComponent } from './employee-weekly-wages/manage-employee-weekly-wages/manage-employee-weekly-wages.component';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';

@NgModule({
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    ManageEmployeeComponent,
    AddEmployeeComponent,
    AddDailyStatusComponent_U,
    ManageDailyStatusComponent_U,
    AddLeaveRequestComponent_U,
    ManageLeaveRequestComponent_U,
    AddContractorComponent,
    ManageContractorComponent,
    AddContractComponent,
    ManageContractComponent,
    AddSwipeEntryComponent,
    ManageSwipeEntryComponent,
    AddContractorPaymentComponent,
    ManageContractorPaymentComponent,
    AddContractEmployeeComponent,
    ManageContractEmployeeComponent,
    AddEmployeePayHoursComponent,
    ManageEmployeePayHoursComponent,
    AddEmployeeWeeklyWagesComponent,
    ManageEmployeeWeeklyWagesComponent,
  ],
  imports: [
    CommonModule,
    EmployeeManagementRoutingModule,
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
    MatMenuModule,
    FormsModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSortModule,
    MatStepperModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableExporterModule,
    MatChipsModule,
    IndCurrencyFormat
  ],
})
export class EmployeeManagementModule {}
