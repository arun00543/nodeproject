import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersAndCartRoutingModule } from './orders-and-cart-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { PendingOrdersComponent } from './pending-orders/pending-orders.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { ApproveOrderComponent } from './approve-order/approve-order.component';
import { MatRadioModule } from '@angular/material/radio';
import { AdminCartComponent } from './admin-cart/admin-cart.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';





@NgModule({
  declarations: [
    ProductListComponent,
    PendingOrdersComponent,
    MyOrdersComponent,
    ApproveOrderComponent,
    AdminCartComponent
  ],
  imports: [
    CommonModule,
    OrdersAndCartRoutingModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    DragDropModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatMenuModule,
    MatTooltipModule,
    IndCurrencyFormat
  ]
})
export class OrdersAndCartModule { }
