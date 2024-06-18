import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageBrandComponent } from './brands/manage-brand/manage-brand.component';
import { AddBrandComponent } from './brands/add-brand/add-brand.component';
import { ManageCategoryComponent } from './category/manage-category/manage-category.component';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { ManageUnitsComponent } from './units-of-measures/manage-units/manage-units.component';
import { AddUnitsComponent } from './units-of-measures/add-units/add-units.component';

const routes: Routes = [
  {
    path:'manage-category',
    component:ManageCategoryComponent
  },
  {
    path:'add-category',
    component:AddCategoryComponent

  },
  {
    path:'edit-category',
    component:AddCategoryComponent

  },
  {
    path:'manage-brand',
    component:ManageBrandComponent
  },
  {
    path:'add-brand',
    component:AddBrandComponent

  },
  {
    path:'edit-brand',
    component:AddBrandComponent
  },

  {
    path:'manage-units',
    component:ManageUnitsComponent
  },
  {
    path:'add-units',
    component:AddUnitsComponent

  },
  {
    path:'edit-units',
    component:AddUnitsComponent

  },


  {
    path: 'products',
    loadChildren: () =>
      import('./products-management/products-management.module').then(
        (m) => m.ProductsManagementModule
      ),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagementRoutingModule { }
