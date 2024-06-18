import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageEmployeeComponent } from "./employee/manage-employee/manage-employee.component";
import { AddEmployeeComponent } from "./employee/add-employee/add-employee.component";
import { AddDailyStatusComponent_U } from "./daily-status/add-daily-status-u/add-daily-status-u.component";
import { ManageDailyStatusComponent_U } from "./daily-status/manage-daily-status-u/manage-daily-status-u.component";
import { AddLeaveRequestComponent_U } from "./leave-request/add-leave-request/add-leave-request.component";
import { ManageLeaveRequestComponent_U } from "./leave-request/manage-leave-request/manage-leave-request.component";
import { DashboardComponent } from "./dashboard/dashboard/dashboard.component";
import { AddContractorComponent } from "./contractor/add-contractor/add-contractor.component";
import { ManageContractorComponent } from "./contractor/manage-contractor/manage-contractor.component";
import { AddContractComponent } from "./assign-contractor/add-contract/add-contract.component";
import { ManageSwipeEntryComponent } from "./swipe-entry/manage-swipe-entry/manage-swipe-entry.component";
import { AddSwipeEntryComponent } from "./swipe-entry/add-swipe-entry/add-swipe-entry.component";
import { ManageContractorPaymentComponent } from "./contractor-payment/manage-contractor-payment/manage-contractor-payment.component";
import { ManageContractComponent } from "./assign-contractor/manage-contract/manage-contract.component";
import { AddContractorPaymentComponent } from "./contractor-payment/add-contractor-payment/add-contractor-payment.component";
import { ManageContractEmployeeComponent } from "./contract-employee/manage-contract-employee/manage-contract-employee.component";
import { AddContractEmployeeComponent } from "./contract-employee/add-contract-employee/add-contract-employee.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { ManageEmployeePayHoursComponent } from "./employee-pay-hours/manage-employee-pay-hours/manage-employee-pay-hours.component";
import { AddEmployeePayHoursComponent } from "./employee-pay-hours/add-employee-pay-hours/add-employee-pay-hours.component";
import { ManageEmployeeWeeklyWagesComponent } from "./employee-weekly-wages/manage-employee-weekly-wages/manage-employee-weekly-wages.component";
import { AddEmployeeWeeklyWagesComponent } from "./employee-weekly-wages/add-employee-weekly-wages/add-employee-weekly-wages.component";

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  {
    path: "user-profile",
    component: UserProfileComponent,
  },
  {
    path: "add-employee",
    component: AddEmployeeComponent,
  },
  {
    path: "edit-employee",
    component: AddEmployeeComponent,
  },
  {
    path: "manage-employee",
    component: ManageEmployeeComponent,
  },

  // contractor
  {
    path: "create-contractor",
    component: AddContractorComponent,
  },
  {
    path: "edit-contractor",
    component: AddContractorComponent,
  },
  {
    path: "manage-contractor",
    component: ManageContractorComponent,
  },

 // contract
 {
  path: "add-contract",
  component: AddContractComponent,
},
{
  path: "edit-contract",
  component: AddContractComponent,
},
{
  path: "manage-contract",
  component: ManageContractComponent,
},

  //Employee-DailyStatus - User
  {
    path: "add-daily-status",
    component: AddDailyStatusComponent_U,
  },
  {
    path: "edit-daily-status",
    component: AddDailyStatusComponent_U,
  },
  {
    path: "manage-daily-status",
    component: ManageDailyStatusComponent_U,
  },

  //Employee-LeaveManager - User
  {
    path: "add-leave-request",
    component: AddLeaveRequestComponent_U,
  },
  {
    path: "edit-leave-request",
    component: AddLeaveRequestComponent_U,
  },
  {
    path: "manage-leave-request",
    component: ManageLeaveRequestComponent_U,
  },

  //swipe entry
  {
    path: "manage-swipe-entry",
    component: ManageSwipeEntryComponent,
  },
  {
    path: "add-swipe-entry",
    component:AddSwipeEntryComponent,
  },
  {
    path: "edit-swipe-entry",
    component: AddSwipeEntryComponent,
  },
  // contractor payment
  {
    path: "manage-contractor-payment",
    component: ManageContractorPaymentComponent,
  },
  {
    path: "add-contractor-payment",
    component:AddContractorPaymentComponent,
  },
  {
    path: "edit-contractor-payment",
    component: AddContractorPaymentComponent,
  },

  // contractor employee
  {
    path: "manage-contract-employee",
    component: ManageContractEmployeeComponent,
  },
  {
    path: "add-contract-employee",
    component:AddContractEmployeeComponent,
  },
  {
    path: "edit-contract-employee",
    component: AddContractEmployeeComponent,
  },

  //Employee-pay-hours
  {
    path: "manage-employee-pay-hours",
    component: ManageEmployeePayHoursComponent,
  },
  {
    path: "add-employee-pay-hours",
    component:AddEmployeePayHoursComponent,
  },
  {
    path: "edit-employee-pay-hours",
    component: AddEmployeePayHoursComponent,
  },

  //Employee-weekly-hours
  {
    path: "manage-employee-weekly-wages",
    component: ManageEmployeeWeeklyWagesComponent,
  },
  {
    path: "add-employee-weekly-wages",
    component:AddEmployeeWeeklyWagesComponent,
  },
  {
    path: "edit-employee-weekly-wages",
    component: AddEmployeeWeeklyWagesComponent,
  },

  //contract pay

  // {
  //   path:"manage-contract-details",
  //   component:ManageContractDetailsComponent
  // },
  // {
  //   path:"edit-contract-details",
  //   component:AddContractDetailsComponent
  // },
  // {
  //   path:"add-contract-details",
  //   component:AddContractDetailsComponent
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeManagementRoutingModule {}
