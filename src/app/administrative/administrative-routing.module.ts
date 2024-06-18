import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRejectReasonComponent } from './reject-reason/add-reject-reason/add-reject-reason.component';
import { ManageRejectReasonComponent } from './reject-reason/manage-reject-reason/manage-reject-reason.component';
import { ManageAlertContentComponent } from './alert-content/manage-alert-content/manage-alert-content.component';
import { AddAlertContentComponent } from './alert-content/add-alert-content/add-alert-content.component';
import { ExcelImportExportComponent } from './excel-import-export/excel-import-export.component';
import { GeneralNotificationComponent } from './general-notification/general-notification.component';
import { HolidayTrackerComponent } from './holiday-tracker/holiday-tracker.component';
import { PayConfigurationComponent } from './pay-configuration/pay-configuration.component';
import { EmployeeMonthlyPayComponent } from './employee-monthly-pay/employee-monthly-pay.component';
import { FailedNotificationComponent } from './failed-notification/failed-notification.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'add-leave-reject-reason',
    pathMatch: 'full'
  },
  {
    path: 'add-reject-reason',
    component: AddRejectReasonComponent
  },
  {
    path: 'edit-reject-reason',
    component: AddRejectReasonComponent
  },
  {
    path: 'manage-reject-reason',
    component: ManageRejectReasonComponent
  },
  {
    path: 'add-alert-message',
    component: AddAlertContentComponent
  },
  {
    path: 'edit-alert-message',
    component: AddAlertContentComponent
  },
  {
    path: 'manage-alert-message',
    component: ManageAlertContentComponent
  },
  {
    path: ":parent/excel-import-export",
    component: ExcelImportExportComponent,
  },
  {
    path: "notification",
    component: GeneralNotificationComponent,
  },
  {
    path: "failed-notification",
    component: FailedNotificationComponent,
  },
  {
    path: "holiday-tracker",
    component: HolidayTrackerComponent,
  },
  {
    path: "pay-configuration",
    component: PayConfigurationComponent,
  },
  {
    path: "employee-monthly-pay",
    component: EmployeeMonthlyPayComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativeRoutingModule { }
