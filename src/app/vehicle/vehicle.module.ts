import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { MatTableExporterModule } from 'mat-table-exporter';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';
@NgModule({
  declarations: [
    AddVehicleComponent,
    ManageVehicleComponent,
    AddMaintenanceComponent,
    ManageMaintenanceComponent,
    AddServiceBreakdownComponent,
    ManageServiceBreakdownComponent,
    AddVehicleTypeComponent,
    ManageVehicleTypeComponent,
    AddServiceItemsComponent,
    ManageServiceItemsComponent
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
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
MatPaginatorModule,
MatRadioModule,
MatTableExporterModule,
IndCurrencyFormat
  ]
})
export class VehicleModule { }
