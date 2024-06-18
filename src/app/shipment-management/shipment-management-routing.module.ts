import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { ManageShipmentComponent } from './manage-shipment/manage-shipment.component';
import { ShipmentDetailsComponent } from './shipment-details/shipment-details.component';
import { ShipmentStatusComponent } from './shipment-status/shipment-status.component';

const routes: Routes = [
  {
    path:'update-shipment',
    component:AddShipmentComponent,
  },
  {
    path:'manage-shipment',
    component:ManageShipmentComponent
  },
  {
    path: 'edit-shipment/update-shipment',
    component: ManageShipmentComponent
  },
  {
    path: 'shipment-details',
    component: ShipmentDetailsComponent
  },
  {
    path: 'shipment-status',
    component: ShipmentStatusComponent
  },
  {
    path: 'edit-shipment/manage-maintenance',
    component: ManageShipmentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentManagementRoutingModule { }
