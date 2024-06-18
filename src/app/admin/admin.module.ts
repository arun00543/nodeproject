import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AddDepartmentComponent } from './department/add-department/add-department.component';
import { ManageDepartmentComponent } from './department/manage-department/manage-department.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { AddDailyStatusComponent_A } from './daily-status/add-daily-status/add-daily-status.component';
import { ManageDailyStatusComponent_A } from './daily-status/manage-daily-status/manage-daily-status.component';
import { AddLeaveComponent_A } from './leave-request/add-leave/add-leave.component';
import { ManageLeaveComponent_A } from './leave-request/manage-leave/manage-leave.component';
import { LeaveHistoryComponent } from './leave-history/leave-history.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';


@NgModule({
  declarations: [
       AddDepartmentComponent,
       ManageDepartmentComponent,
       AddDailyStatusComponent_A,
       ManageDailyStatusComponent_A,
       AddLeaveComponent_A,
       ManageLeaveComponent_A,
       LeaveHistoryComponent,
       ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
     ReactiveFormsModule,
     MatAutocompleteModule,
     MatButtonModule,
     MatButtonToggleModule,
     MatCheckboxModule,
     MatDatepickerModule,
     MatNativeDateModule,
     MatDialogModule,
     MatGridListModule,
     MatInputModule,
     MatListModule,
     MatMenuModule ,
     FormsModule,
 MatRadioModule,
 MatSelectModule ,
 MatSidenavModule ,
 MatSlideToggleModule ,
  MatSliderModule ,
 MatSortModule ,
 MatStepperModule ,
 MatToolbarModule,
 MatTooltipModule,
 MatCardModule,
MatTabsModule,
MatTableExporterModule,
MatCheckboxModule,
 IndCurrencyFormat
  ]
})
export class AdminModule { }
