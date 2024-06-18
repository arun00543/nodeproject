import { Component, DoCheck, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { SharedService } from "app/shared/shared.service";
import { InventoryService } from "app/core/service/inventory/inventory.service";
import { OrdersService } from "app/core/service/orders/orders.service";
import { BillingService } from "app/core/service/billing/billing.service";
import { sort } from "app/core/models/sort";
import { DatePipe } from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MatTableExporterDirective, ExportType } from "mat-table-exporter";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "app/additional-components/confirmation-dialog/confirmation-dialog.component";
import { AuthService } from "app/core/service/auth.service";

export class list {
  id: number;
  itemMaster: any;
  order: any;
  unitOfMeasure: any;
  orderedQuantity: number;
  itemId: number;
  unitPrice: number;
}
@Component({
  selector: "app-approve-order",
  templateUrl: "./approve-order.component.html",
  styleUrls: ["./approve-order.component.scss"],
})
export class ApproveOrderComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  displayedColumns = [
    // 'select',
    "orderId",
    "customer",
    "orderStatus",
    "actions",
  ];
  dataSource: any;
  hideItemList = false;
  hidePayHistory = false;
  hideOutstandingPayment = false;
  rise = false;
  reject = false;
  data: any;
  searchTerm: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  deleteReason: UntypedFormGroup;
  acceptPrice: UntypedFormGroup;
  itemList: Array<list> = [];
  paymentList: [];
  outStandingPaymentList: [];
  backupList: Array<list> = [];
  orderData: any;
  customerName: string = "";
  outstandingPayment: number;
  total = null;
  rejectBtn = true;
  rejectReason = [];
  orderDetails: any;
  currentUser: any;

  constructor(
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private orderService: OrdersService,
    private inventoryService: InventoryService,
    private billingService: BillingService,
    private notification: NotificationsComponent,
    private authService: AuthService,
    private shared: SharedService,
    public datepipe: DatePipe
  ) {
    this.orderDetails = shared.orderDetail;
    this.currentUser = authService.currentUserValue.userId;
  }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
    if (this.orderDetails) {
      this.getOrderDetails();
    }
    this.deleteReason = this.fb.group({
      id: [],
      reason: [, [Validators.required]],
    });
    this.acceptPrice = this.fb.group({
      id: [],
      price: ["", [Validators.required]],
    });
  }

  ngOnDestroy() {
    this.shared.orderDetail = null;
  }

  viewListCall(row) {
    this.backupList = [];
    this.reject = false;
    this.rejectBtn = true;
    this.deleteReason.reset();
    this.orderDetails = row;
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.orderService
      .getOrderById(this.orderDetails.orderId)
      .subscribe((res) => {
        this.itemList = res.data;
        for (let data of this.itemList) {
          this.backupList.push(Object.assign({}, data));
          const tex = data;
          tex.unitPrice = data.itemMaster.fixedPrice;
          tex.itemId = data.itemMaster.id;
        }
        this.totalPrice();
      });
    let id: number;
    if (this.orderDetails.customerId) {
      id = this.orderDetails.customerId;
      this.customerName = this.orderDetails.customer;
    } else {
      id = this.orderDetails.customer.id;
      this.customerName = this.orderDetails.customer.name;
    }
    this.orderService
      .getOutstandingPaymentById(id, "admin")
      .subscribe((res) => {
        this.outstandingPayment = res.data;
      });
    this.hideItemList = true;
    this.hidePayHistory = false;
    this.hideOutstandingPayment = false;
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }

  viewHistoryCall(row) {
    this.billingService.getPaymentHistory(row.customerId).subscribe((res) => {
    if(res){
    this.paymentList = res.data;
      this.hidePayHistory = true;
      this.hideItemList = false;
      this.customerName = row.customer;
    }
    });

  }

  viewOutstandingCall() {
    let id: number;
    if (this.orderDetails.customerId) {
      id = this.orderDetails.customerId;
      this.customerName = this.orderDetails.customer;
    } else {
      id = this.orderDetails.customer.id;
      this.customerName = this.orderDetails.customer.name;
    }
    this.billingService.getOutstandingPayment(id).subscribe((res) => {
      this.outStandingPaymentList = res.data;
    });
    this.hideOutstandingPayment = true;
    this.hideItemList = true;
  }

  totalPrice() {
    this.total = 0;
    for (let data of this.itemList) {
      this.total +=
        data.unitPrice * (data.unitOfMeasure.unitWeight * data.orderedQuantity);
    }
  }

  onSelectReason(data) {
    this.deleteReason.controls["reason"].setValue(data);
  }

  removeObject(index: number, row: any) {
    // const index: number = this.itemList.indexOf(row);
    if (index != -1) {
      this.itemList.splice(index, 1);
      this.backupList.splice(index, 1);
    }
    this.totalPrice();
  }

  onChangeOrder(item: any, event, index) {
    if (event.checked) {
      this.itemList[index].unitPrice = item.unitPrice;
    } else {
      this.itemList[index].unitPrice = item.itemMaster.fixedPrice;
    }
    this.totalPrice();
  }

  onChangeCustom(item: any, event, index) {
    if (event.checked) {
      // this.itemList[index].unitPrice = item.unitPrice;
    } else {
      this.itemList[index].unitPrice = item.itemMaster.fixedPrice;
    }
    this.totalPrice();
  }
  subValue = null;
  onChangeInput(event, index) {
    const value = event.target.value;
    let myTextBox = (event.target as HTMLInputElement);
    myTextBox.focus();

    const regex = /^[0-9]*(\.[0-9]{0,2})?$/;
    
    if (regex.test(value)) {
    myTextBox.setSelectionRange(value.length,value.length);
    let i = value.indexOf('.')
    let decimal = value.slice(i)
    if (decimal.length <= 3){
      this.subValue = value
    }
   
   } 
   this.itemList[index].unitPrice = this.subValue;
   myTextBox.value = this.itemList[index].unitPrice ? this.itemList[index].unitPrice.toString() : '';
   this.totalPrice();
  }

  cancel() {
    this.backupList = [];
    this.hideItemList = false;
    this.hidePayHistory = false;
    this.hideOutstandingPayment = false;
    this.deleteReason.reset();
  }

  actionCall(action: string) {
    if (action != "reject") {
      this.reject = false;
      this.rejectBtn = true;
      this.approveOrder();
    } else {
      this.reject = true;
      this.rejectBtn = false;
    }
    this.rise = true;
  }

  reset() {
    this.itemList = null;
    this.orderData = null;
    this.hideItemList = false;
    this.total = null;
    this.shared.orderDetail = null;
  }

  approveOrder() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: "Approve",
        id: this.itemList[0]?.order.orderId
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.orderData = {
          orderId: this.itemList[0].order.orderId,
          itemDetails: this.itemList,
          orderStatus: "APPROVED",
          updatedBy: this.currentUser,
        };

        this.inventoryService.approveOrder(this.orderData).subscribe((res) => {
          let message;
          if (res.status === "OK") {
            this.reset();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: res.message,
                status: "success",
              })
            );
            this.loadData();
          } else {
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: res.message,
                status: "warning",
              })
            );
          }
        });
      }
    });
  }

  rejectOrder() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: "Reject",
        id: this.itemList[0]?.order.orderId
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.orderData = {
          orderId: this.itemList[0].order.orderId,
          itemDetails: this.itemList,
          orderStatus: "REJECTED",
          rejectReasonId: {
            id: this.deleteReason.value.reason.id
          },
          updatedBy: this.currentUser
        };

        this.inventoryService.approveOrder(this.orderData).subscribe((res) => {
          let message;
          if (res.status === "OK") {
            this.reset();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: res.message,
                status: "success",
              })
            );
            this.loadData();
          } else {
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: res.message,
                status: "warning",
              })
            );
          }
        });
      }
    });
  }

  currentDateTime = this.datepipe.transform(new Date(), "MM-dd-yyyy h-mm-ss");

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Order_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Order Details", 15, 25);
    autoTable(doc, {
      theme: "grid",
      styles: { halign: "center", fillColor: [78, 78, 229] },
      bodyStyles: { fillColor: [235, 235, 238] },
      margin: { top: 40 },
      body: data,
      columns: [
        { header: "Order Id", dataKey: "orderId" },
        { header: "Customer", dataKey: "customer" },
        { header: "Order Status", dataKey: "orderStatus" },
      ],
    });
    doc.save("KPR_Order_Details_" + this.currentDateTime);
  }

  sortData(event: Sort) {
    this.sortEvent = event;
    this.sort.disableClear = true;
    this.paginator.firstPage();
    this.loadData();
  }

  getPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadData();
  }

  search() {
    this.paginator.firstPage();
    this.loadData();
  }

  public loadData() {
    this.hideItemList = false;
    this.orderService
      .getOrderStatusList(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.searchTerm,
        "PENDING"
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });

    this.orderService.getReason("OrderRejection").subscribe((response: any) => {
      this.rejectReason = response.data;
    });
  }
}
