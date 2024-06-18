import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import {
  UntypedFormBuilder,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { OrdersService } from "app/core/service/orders/orders.service";
import { ShipmentService } from "app/core/service/shipment/shipment.service";
import { sort } from "app/core/models/sort";
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MatTableExporterDirective, ExportType } from "mat-table-exporter";

@Component({
  selector: 'app-shipment-details',
  templateUrl: './shipment-details.component.html',
  styleUrls: ['./shipment-details.component.scss']
})
export class ShipmentDetailsComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  public focus;
  displayedColumns = [
    // 'select',

    'shipmentId',
    // 'carrier',
    'shipmentDate',
    // 'trackingNumber',
    'item',
    'orderQuantity',
    'shippedQuantity',
    'balanceQuantity',
    'status'
  ];

  status: any[] = [
    { value: "LOADING" },
    { value: "UNLOADING" },
    { value: "DELIVERED" },
    { value: "PENDING" },
    { value: "SHIPPED" },
  ];
  itemList: any;
  total = null;
  customerName: string;
  selectedOption: string;
  dataSource: any;
  rows = [];
  loading = false;
  hide = false;
  userDetails: any;
  data: any = [];
  filteredData = [];
  searchTerm: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;

  constructor(
    private fb: UntypedFormBuilder,
    public router: Router,
    public shipmentService: ShipmentService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private orderService: OrdersService,
    private spinner: NgxSpinnerService,
    public datepipe:DatePipe
  ) {

  }
  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );


  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Shipment_History_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Shipment History", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
  
          { header: "Shipment id ", dataKey: "shipmentId" },
          { header: "Shipment Date", dataKey: "shipmentDate" },
          { header: "Item", dataKey: "item" },
          { header: "Order Quality", dataKey: "orderQuantity" },
          { header: "Shipped Quantity", dataKey: "shippedQuantity" },
          { header: "Balance Quantity", dataKey: "balanceQuantity" },
          { header: "Status", dataKey: "status" },


        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'shipmentId') {
            var text = data.row.raw["shipmentId"].salesId;
            if (text && text.length > 0) {
              data.cell.text = text;
            }
          }
        }
      }
    );
    doc.save("KPR_Shipment_History_" + this.currentDateTime);
  }
  sortData(event: Sort) {
    this.sortEvent = event;
    this.sort.disableClear = true;
    this.paginator.firstPage();
this.loadData();
  }
  

  ngOnInit(): void {
    this.loadData();
  }

  viewCall(row) {
    
    this.orderService.getOrderBySalesId(row.salesId).subscribe((res) => {
      this.itemList = res.data
      this.totalPrice();
    });
    this.hide = true;
    this.customerName = row.customerName
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
    
  }

  totalPrice() {
    this.total = 0;
    for (let data of this.itemList) {
      this.total += data.itemMaster.fixedPrice * (data.quantity * data.orderQuantity);
    }
  }

  public loadData() {
    
    this.loading = true;
    this.hide = false

    this.shipmentService.getShipmentDetailsListing(
      this.pageIndex,
      this.pageSize,
      this.sortEvent.direction.toUpperCase(),
      this.sortEvent.active,
      this.searchTerm
    ).subscribe((response) => {
      if (response.status === "OK") {
        this.data = response.data;
        this.dataSource = this.data.content

        
      }
    });
  }
}
