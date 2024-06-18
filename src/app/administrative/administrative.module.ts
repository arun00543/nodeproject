import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrativeRoutingModule } from './administrative-routing.module';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
import { MatTableExporterModule } from 'mat-table-exporter';
import { AddRejectReasonComponent } from './reject-reason/add-reject-reason/add-reject-reason.component';
import { ManageRejectReasonComponent } from './reject-reason/manage-reject-reason/manage-reject-reason.component';
import { ManageAlertContentComponent } from './alert-content/manage-alert-content/manage-alert-content.component';
import { AddAlertContentComponent } from './alert-content/add-alert-content/add-alert-content.component';
import {MatChipsModule} from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ExcelImportExportComponent } from './excel-import-export/excel-import-export.component';
import { GeneralNotificationComponent } from './general-notification/general-notification.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { HolidayTrackerComponent } from './holiday-tracker/holiday-tracker.component';
import { PayConfigurationComponent } from './pay-configuration/pay-configuration.component';
import { EmployeeMonthlyPayComponent } from './employee-monthly-pay/employee-monthly-pay.component';
import { EventDialogComponent } from 'app/additional-components/event-dialog/event-dialog.component';
import { FailedNotificationComponent } from './failed-notification/failed-notification.component';


@NgModule({
  declarations: [
    AddRejectReasonComponent,
    ManageRejectReasonComponent,
    ManageAlertContentComponent,
    AddAlertContentComponent,
    ExcelImportExportComponent,
    GeneralNotificationComponent,
    HolidayTrackerComponent,
    PayConfigurationComponent,
    EmployeeMonthlyPayComponent,
    EventDialogComponent,
    FailedNotificationComponent,
  ],
  imports: [
    CommonModule,
    AdministrativeRoutingModule,
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
    MatMenuModule,
    FormsModule,
    MatExpansionModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSortModule,
    MatStepperModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableExporterModule,
    MatChipsModule,
    DragDropModule
  ]
})
export class AdministrativeModule { }
