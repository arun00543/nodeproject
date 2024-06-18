import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllItemsComponent } from './all-items/all-items.component';
import { AddItemsComponent } from './add-items/add-items.component';
import { AddBrandComponent } from '../brands/add-brand/add-brand.component';
import { AddCategoryComponent } from '../category/add-category/add-category.component';
import { AddUnitsComponent } from '../units-of-measures/add-units/add-units.component';


const routes: Routes = [
  {
    path:'manage-items',
    component:AllItemsComponent
  },
  {
    path:'add-category',
    component:AddCategoryComponent

  },
  {
    path:'add-brand',
    component:AddBrandComponent

  },
  {
    path:'add-units',
    component:AddUnitsComponent

  },
  {
    path:'add-items',
    component:AddItemsComponent

  },
  {
    path:'edit-items',
    component:AddItemsComponent

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsManagementRoutingModule { }
