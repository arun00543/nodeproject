import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import {
  UntypedFormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { SharedService } from "app/shared/shared.service";
import { Observable, map, startWith } from "rxjs";
import { ShipmentService } from "app/core/service/shipment/shipment.service";
import { AuthService } from "app/core/service/auth.service";
import { VehicleService } from "app/core/service/vehicle/vehicle.service";

export class shipment {
  itemMaster: any;
  unitPrice: number;
  quantity: number;
  shippedQuantity: number = 0;
  balanceQuantity: number = 0;
}
@Component({
  selector: "app-manage-shipment",
  templateUrl: "./manage-shipment.component.html",
  styleUrls: ["./manage-shipment.component.scss"],
})
export class ManageShipmentComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  displayedColumns = [
    "select",
    "itemMaster",
    "unitPrice",
    "quantity",
    "shippedQuantity",
    "shippingQuantity",
    "balanceQuantity",
    "status",
  ];
  shipmentLoad: FormGroup;
  currentUser: any;
  hideItemList = false;
  dataSource: any;
  selection = new SelectionModel<any>(true, []);
  carrierControl = new FormControl("");
  filteredcarrierOptions: Observable<any[]>;
  hide = false;
  data: any;
  salseId: number;
  total: number = 0;
  itemDetail: any;
  itemList: Array<shipment> = [];
  vehicleDetails: any;
  wallet:any;

  constructor(
    private fb: UntypedFormBuilder,
    public router: Router,
    private authService: AuthService,
    public vehicleService: VehicleService,
    public shipmentService: ShipmentService,
    private notification: NotificationsComponent,
    private shared: SharedService
  ) {
    this.salseId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId;
  }

  refresh() {
    this.shipmentLoad.controls['remark'].reset();
    this.selection.clear();
    this.loadData();
  }

  ngOnInit(): void {
    this.shipmentLoad = this.fb.group({
      salesId: [],
      isPartialShipment: ["", [Validators.required]],
      itemAndQuantityDto: ["", [Validators.required]],
      carrier: ["", [Validators.required]],
      remark: [""],
      updatedBy: [this.currentUser],
    });
    this.loadData();
    this.vehicleService.getVehicle().subscribe((response: any) => {
      this.vehicleDetails = response.data;
      this.filteredcarrierOptions = this.carrierControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          this.shipmentLoad.controls["carrier"].setValue("");
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string)
            : this.vehicleDetails.slice();
        })
      );
    });    
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.vehicleDetails.filter((option) =>
      option.vehicleRegistrationNumber.toLowerCase().includes(filterValue)
    );
  }

  public displayPropertyVehicleType(value) {
    if (value) {
      return value;
    }
  }

  onChange(value) {
      if (value > this.itemDetail.balanceQuantity) {
      this.itemDetail.shippingQuantity = this.itemDetail.balanceQuantity;
    } else {
      this.itemDetail.shippingQuantity = value ? value : 0;
    }
      this.dataSource.forEach((row) => {
        if (row.shipmentStatus != "SHIPPED") {
        if (row.orderItem.id === this.itemDetail.orderItem.id) {
          if(row.shippingQuantity > 0) {
            this.selection.select(row);
          } else {
          this.selection.deselect(row);
          }
        }
        }
      })
    this.calculatePayment();
  }

  onSelect(event: any) {
    let data = event.option.value;
    this.shipmentLoad.controls["carrier"].setValue(data);
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows = 0;
    for (let row of this.dataSource) {
      if (row.shipmentStatus != "SHIPPED") {
        numRows = numRows + 1;
      }
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.removeSelectedRows()
      : this.dataSource.forEach((row) => {
          if (row.shipmentStatus != "SHIPPED") {
            this.selection.select(row);
            row.shippingQuantity <= 0
              ? (row.shippingQuantity = row.balanceQuantity)
              : '';
          }
        });
        this.calculatePayment();
  }

  removeSelectedRows(){
    this.selection.clear();
      this.dataSource.forEach((row) => {
        if (row.shipmentStatus != "SHIPPED") {
          row.shippingQuantity =0
        }
      })
  }

  valueToggle(row) { 
    if(row.shippingQuantity <= 0){
      row.shippingQuantity = row.balanceQuantity
    } else {
      row.shippingQuantity = 0
    }
    this.calculatePayment();
  }

  calculatePayment(){
    this.total = 0;
    if(this.selection.selected.length > 0){
      for (let data of this.selection.selected) {
        this.total +=
          data.orderItem.unitPrice * (data.orderItem.unitOfMeasure.unitWeight * data.shippingQuantity);
      }
    }
  }

  public loadData() {
    this.hide = false;
    this.total = 0;
    this.carrierControl.reset();
    this.shipmentService
      .getShipmentBySalesId(this.salseId)
      .subscribe((response: any) => {
        if(response){
          this.data = response.data;
          if(this.data.length != 0 ){
          this.getWalletAmount(this.data[0].orderItem.order.customer.id)
          }
          this.itemList = this.data.map((i) => {
            i["shippingQuantity"] = 0;
            return i;
          });
          this.dataSource = this.itemList;
          this.shipmentLoad.controls["salesId"].setValue(this.salseId);
          this.shipmentLoad.controls["isPartialShipment"].setValue(true);
        }
      });
  }

  getWalletAmount(id){
    this.shipmentService.getShipmenWallet(id).subscribe((response: any) => {
      this.wallet = response.data;
      })
  }

  viewListCall(row) {
    this.hideItemList = true;
    this.itemDetail = row;
  }

  confirm() {
    let itemArr = [];
    for (let item of this.selection.selected) {
      let tempObj = {
        orderItem: item.orderItem,
        shippingQuantity: item.shippingQuantity
      };
      itemArr.push(tempObj);
    }
    this.shipmentLoad.controls["itemAndQuantityDto"].setValue(itemArr);
    this.shipmentService
      .updateShipment(this.shipmentLoad.value)
      .subscribe((response: any) => {
        let message;
        if (response.status === "OK") {
          this.notification.showNotification(
            "top",
            "right",
            (message = {
              message: response.message,
              status: "success",
            })
          );
          this.router.navigate(["/shipment/update-shipment"]);
          this.data = [];
        } else {
          this.notification.showNotification(
            "top",
            "right",
            (message = {
              message: response.message,
              status: "warning",
            })
          );
        }
      });
  }
}
