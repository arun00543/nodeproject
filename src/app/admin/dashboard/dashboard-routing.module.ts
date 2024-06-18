import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SuperDashboardComponent } from './super-dashboard/super-dashboard.component';

const routes: Routes = [
  { path: '',   component: DashboardComponent },
  { path: 'super/dashboard',   component: SuperDashboardComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
