import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMachinaryComponent } from './machinery/add-machinary/add-machinary.component';
import { ManageMachinaryComponent } from './machinery/manage-machinary/manage-machinary.component';
import { AddMaintenanceComponent } from './maintenance/add-maintenance/add-maintenance.component';
import { ManageMaintenanceComponent } from './maintenance/manage-maintenance/manage-maintenance.component';
import { AddServiceBreakdownComponent } from './service-breakdown/add-service-breakdown/add-service-breakdown.component';
import { ManageServiceBreakdownComponent } from './service-breakdown/manage-service-breakdown/manage-service-breakdown.component';
import { AddSparesComponent } from './spares-in-stock/add-spares/add-spares.component';
import { ManageSparesComponent } from './spares-in-stock/manage-spares/manage-spares.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'add-machinery',
    pathMatch: 'full'
  },
  {
    path: 'add-machinery',
    component: AddMachinaryComponent
  },
  {
    path: 'edit-machinery',
    component: AddMachinaryComponent
  },
  {
    path: 'manage-machinery',
    component: ManageMachinaryComponent
  },
  {
    path: 'add-maintenance',
    component: AddMaintenanceComponent
  },
  {
    path: 'edit-maintenance',
    component: AddMaintenanceComponent
  },
  {
    path: 'manage-service',
    component: ManageMaintenanceComponent
  },
  {
    path:'add-service-breakdown',
    component: AddServiceBreakdownComponent
  },
  {
    path:'manage-service-breakdown',
    component: ManageServiceBreakdownComponent
  },
  {
    path: 'edit-service-breakdown',
    component: AddMaintenanceComponent
  },{
    path:'add-spares',
    component: AddSparesComponent
  },
  {
    path:'manage-spares',
    component: ManageSparesComponent
  },
  {
    path: 'edit-spares',
    component: AddSparesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachinaryManagementRoutingModule { }
