import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { Role } from './core/models/role';
import { Page404Component } from './authentication/page404/page404.component';
import { AuthGuard } from './core/guard/auth.guard';
import { UpcomingPageComponent } from './components/upcoming-page/upcoming-page.component';
import { NotificationsComponent } from './additional-components/notifications/notifications.component';
import { WebLayoutComponent } from './layouts/web-layout/web-layout.component';

const routes: Routes =[
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/web/home', pathMatch: 'full' },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: {
          role: Role.Admin,
        },
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
       {
        path: 'analytics',
        canActivate: [AuthGuard],
        data: {
          role: Role.Admin,
        },
        loadChildren: () =>
          import('./analytics/analytics.module').then((m) => m.AnalyticsModule),
      },
      {
        path: 'user',
        canActivate: [AuthGuard],
        data: {
          role: Role.Admin,
        },
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'employee',
        canActivate: [AuthGuard],
        data: {
          role: Role.Admin,
        },
        loadChildren: () =>
          import('./employee-management/employee-management.module').then((m) => m.EmployeeManagementModule),
      },
      {
        path: 'inventory',
        canActivate: [AuthGuard],
        data: {
          role: Role.Admin,
        },

        loadChildren: () =>
        import('./inventory-management/inventory-management.module').then(
          (m) => m.InventoryManagementModule
        ),
        },
        {
          path: 'billing',
          canActivate: [AuthGuard],
          data: {
            role: Role.Admin,
          },
  
          loadChildren: () =>
          import('./billing-and-expenses/billing-and-expenses.module').then(
            (m) => m.BillingAndExpensesModule
          ),
          },
          {
            path:'production',
            data :{
              role:Role.Admin,
            },
            loadChildren: () =>
            import('./production-management/production-management.module').then(
              (m) => m.ProductionManagementModule
            ),
          },{
            path:'shipment',
            data:{
              role:Role.Admin,
            },
            loadChildren: () =>
            import('./shipment-management/shipment-management.module').then(
              (m) => m.ShipmentManagementModule
            ),
          },
        {
          path: 'machinery',
          canActivate: [AuthGuard],
          data: {
            role: Role.Admin,
          },

          loadChildren: () =>
          import('./machinary-management/machinary-management.module').then(
            (m) => m.MachinaryManagementModule
          ),
          },
          {
            path: 'crm',
            canActivate: [AuthGuard],
            data: {
              role: Role.Admin,
            },
            loadChildren: () =>
              import('./crm/crm.module').then(
                (m) => m.CrmModule
                ),
          },
          {
            path: 'administrative',
            canActivate: [AuthGuard],
            data: {
              role: Role.Admin,
            },
            loadChildren: () =>
              import('./administrative/administrative.module').then(
                (m) => m.AdministrativeModule
                ),
          },
          {
            path: 'vehicle',
            canActivate: [AuthGuard],
            data: {
              role: Role.Admin,
            },
  
            loadChildren: () =>
            import('./vehicle/vehicle.module').then(
              (m) => m.VehicleModule
            ),
            },
        {
          path: 'order&cart',
          canActivate: [AuthGuard],
          data: {
            role: Role.Admin,
          },
  
          loadChildren: () =>
          import('./orders-and-cart/orders-and-cart.module').then(
            (m) => m.OrdersAndCartModule
          ),
          },
          {
            path: 'faq',
            canActivate: [AuthGuard],
            data: {
              role: Role.Admin,
            },
    
            loadChildren: () =>
            import('./faq/faq.module').then(
              (m) => m.FAQModule
            ),
            },
      {
        path: '',
        data: {
          role: Role.Admin,
        },
        loadChildren: () =>
          import('./layouts/admin-layout/admin-layout.module').then((m) => m.AdminLayoutModule),
      },
      { path: 'upcoming-Page', component: UpcomingPageComponent},
      { path: 'notification', component: NotificationsComponent},
    ],
  }, {
    path: 'web',
    component: WebLayoutComponent,
    loadChildren: () =>
      import('./web/web-app.module').then(
        (m) => m.WebAppModule
      ),
  }, {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: '**', component: Page404Component },
  // { path: '**', redirectTo: '/authentication/login', pathMatch: 'full'},
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
