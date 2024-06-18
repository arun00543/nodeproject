import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMaintenanceComponent } from './maintenance/add-maintenance/add-maintenance.component';
import { ManageMaintenanceComponent } from './maintenance/manage-maintenance/manage-maintenance.component';
import { AddServiceBreakdownComponent } from './service-breakdown/add-service-breakdown/add-service-breakdown.component';
import { ManageServiceBreakdownComponent } from './service-breakdown/manage-service-breakdown/manage-service-breakdown.component';
import { AddVehicleComponent } from './vehical/add-vehicle/add-vehicle.component';
import { ManageVehicleComponent } from './vehical/manage-vehicle/manage-vehicle.component';
import { AddVehicleTypeComponent } from './vehicle-type/add-vehicle-type/add-vehicle-type.component';
import { ManageVehicleTypeComponent } from './vehicle-type/manage-vehicle-type/manage-vehicle-type.component';
import { AddServiceItemsComponent } from './service-items/add-service-items/add-service-items.component';
import { ManageServiceItemsComponent } from './service-items/manage-service-items/manage-service-items.component'; 

const routes: Routes = [
  {
    path:'add-service',
    component:AddMaintenanceComponent
  },
  {
    path:'edit-service',
    component:AddMaintenanceComponent
  },
  {
    path:'manage-service',
    component:ManageMaintenanceComponent
  },
  {
    path:'add-service-breakdown',
    component:AddServiceBreakdownComponent
  },
  {
    path:'manage-service-breakdown',
    component:ManageServiceBreakdownComponent
  },
  {
    path:'edit-service-breakdown',
    component:AddServiceBreakdownComponent
  },
  {
    path:'add-vehicle',
    component:AddVehicleComponent
  },
  {
    path:'manage-vehicle',
    component:ManageVehicleComponent
  },
  {
    path:'edit-vehicle',
    component:AddVehicleComponent
  },
  {
    path:'add-vehicle-type',
    component:AddVehicleTypeComponent
  },
  {
    path:'manage-vehicle-type',
    component:ManageVehicleTypeComponent
  },
  {
    path:'edit-vehicle-type',
    component:AddVehicleTypeComponent
  },
  {
    path:'add-service-items',
    component:AddServiceItemsComponent
  },
  {
    path:'manage-service-items',
    component:ManageServiceItemsComponent
  },
  {
    path:'edit-service-items',
    component:AddServiceItemsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
