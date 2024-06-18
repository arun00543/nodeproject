import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
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
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MachinaryManagementRoutingModule } from './machinary-management-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { ManageMachinaryComponent } from './machinery/manage-machinary/manage-machinary.component';
import { AddMachinaryComponent } from './machinery/add-machinary/add-machinary.component';
import { AddMaintenanceComponent } from './maintenance/add-maintenance/add-maintenance.component';
import { ManageMaintenanceComponent } from './maintenance/manage-maintenance/manage-maintenance.component';
import { AddSparesComponent } from './spares-in-stock/add-spares/add-spares.component';
import { ManageSparesComponent } from './spares-in-stock/manage-spares/manage-spares.component';
import { AddServiceBreakdownComponent } from './service-breakdown/add-service-breakdown/add-service-breakdown.component';
import { ManageServiceBreakdownComponent } from './service-breakdown/manage-service-breakdown/manage-service-breakdown.component';
import { MatTableExporterModule } from 'mat-table-exporter';


@NgModule({
  declarations: [
    ManageMachinaryComponent,
    AddMachinaryComponent,
    AddMaintenanceComponent,
    ManageMaintenanceComponent,
    AddSparesComponent,
    ManageSparesComponent,
    AddServiceBreakdownComponent,
    ManageServiceBreakdownComponent
  ],
  imports: [
    CommonModule,
   MachinaryManagementRoutingModule,
     ReactiveFormsModule,
     MatAutocompleteModule,
     MatButtonModule,
     MatButtonToggleModule,
     MatCheckboxModule,
     MatDatepickerModule,
     MatNativeDateModule,
     MatDialogModule,
     MatFormFieldModule,
     MatGridListModule,
     MatIconModule,
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
MatTableModule,
MatProgressSpinnerModule,
MatPaginatorModule,
MatTableExporterModule,

    
  ]
})
export class MachinaryManagementModule { }
