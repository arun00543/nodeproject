import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsManagementRoutingModule } from './products-management-routing.module';
import { AllItemsComponent } from './all-items/all-items.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';

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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AddItemsComponent } from './add-items/add-items.component';
import {MatChipsModule} from '@angular/material/chips';
import { NgxEditorModule } from 'ngx-editor';
import { MatTableExporterModule } from 'mat-table-exporter';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';


@NgModule({
  declarations: [
    AllItemsComponent,
    AddItemsComponent,
  ],
  imports: [
    CommonModule,
    ProductsManagementRoutingModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
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
NgxEditorModule,
MatTableExporterModule,
IndCurrencyFormat

  ]
})
export class ProductsManagementModule { }
