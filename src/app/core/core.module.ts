import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './service/auth.service';
import { throwIfAlreadyLoaded } from './guard/module-import.guard';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guard/auth.guard';
import { UserService } from './service/user.service';
import { InventoryService } from './service/inventory/inventory.service';
import { MachineryService } from './service/machinery/machinery.service';
import { ShipmentService } from './service/shipment/shipment.service';
import { BillingService } from './service/billing/billing.service';
import { OrdersService } from './service/orders/orders.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    UserService,
    InventoryService,
    MachineryService,
    ShipmentService,
    BillingService,
    OrdersService
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
