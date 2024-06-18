import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDepartmentComponent } from './department/add-department/add-department.component';
import { ManageDepartmentComponent } from './department/manage-department/manage-department.component';
import { AddDailyStatusComponent_A } from './daily-status/add-daily-status/add-daily-status.component';
import { ManageDailyStatusComponent_A } from './daily-status/manage-daily-status/manage-daily-status.component';
import { AddLeaveComponent_A } from './leave-request/add-leave/add-leave.component';
import { ManageLeaveComponent_A } from './leave-request/manage-leave/manage-leave.component';
import { LeaveHistoryComponent } from './leave-history/leave-history.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


const routes: Routes = [

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
   {
     path: 'add-department',
    component:AddDepartmentComponent
  },
  {
    path : 'edit-department',
    component:AddDepartmentComponent
  },
   {
     path: 'manage-department',
    component:ManageDepartmentComponent
  },
         //Employee-DailyStatus
  {
    path: 'add-daily-status',
    component: AddDailyStatusComponent_A
  },
  {
    path: 'edit-daily-status',
    component: AddDailyStatusComponent_A
  },
  {
    path: 'manage-daily-status',
    component: ManageDailyStatusComponent_A
  },
     //Employee-LeaveManager - User
     {
      path: 'add-leave-request',
      component: AddLeaveComponent_A
    },
    {
      path: 'edit-leave-request',
      component: AddLeaveComponent_A
    },
    {
      path: 'manage-leave-request',
      component: ManageLeaveComponent_A
    },
    {
      path: 'leave-history',
      component: LeaveHistoryComponent
    },
    {
      path: 'change-password',
      component: ChangePasswordComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
