import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShipmentManagementRoutingModule } from './shipment-management-routing.module';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { ManageShipmentComponent } from './manage-shipment/manage-shipment.component';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { ShipmentDetailsComponent } from './shipment-details/shipment-details.component';
import { ShipmentStatusComponent } from './shipment-status/shipment-status.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';


@NgModule({
  declarations: [
    AddShipmentComponent,
    ManageShipmentComponent,
    ShipmentDetailsComponent,
    ShipmentStatusComponent
  ],
  imports: [
    CommonModule,
    ShipmentManagementRoutingModule,
    CommonModule,
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
export class ShipmentManagementModule { }
