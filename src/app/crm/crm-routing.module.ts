import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLeadGenerationComponent } from './lead-generation/add-lead-generation/add-lead-generation.component';
import { ManageLeadGenerationComponent } from './lead-generation/manage-lead-generation/manage-lead-generation.component';
import { AddLeadFollowupComponent } from './lead-followup/add-lead-followup/add-lead-followup.component';
import { ManageLeadFollowupComponent } from './lead-followup/manage-lead-followup/manage-lead-followup.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'add-lead-generation',
    pathMatch: 'full'
  },
  {
    path: 'add-lead-generation',
    component: AddLeadGenerationComponent
  },
  {
    path: 'edit-lead-generation',
    component: AddLeadGenerationComponent
  },
  {
    path: 'manage-lead-generation',
    component: ManageLeadGenerationComponent
  },
  {
    path: 'add-lead-followup',
    component: AddLeadFollowupComponent
  },
  {
    path: 'edit-lead-followup',
    component: AddLeadFollowupComponent
  },
  {
    path: 'manage-lead-followup',
    component: ManageLeadFollowupComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
