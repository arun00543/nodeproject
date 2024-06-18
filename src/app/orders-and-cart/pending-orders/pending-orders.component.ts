import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { OrdersService } from "app/core/service/orders/orders.service";
import { sort } from "app/core/models/sort";
import { NgxSpinnerService } from "ngx-spinner";
import { ExportType, MatTableExporterDirective } from "mat-table-exporter";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "app-pending-orders",
  templateUrl: "./pending-orders.component.html",
  styleUrls: ["./pending-orders.component.scss"],
})
export class PendingOrdersComponent implements OnInit {

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
    // "index",
    "orderId",
    "customer",
    "orderStatus",
    //"actions",
  ];
  dataSource: any;
  hide = false;
  loading = false;
  data: any;
  searchTerm: string = "";
  fromDate: string = "";
  toDate: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  customerName: string;
  itemList: any;
  total = null;
  getStatus = "APPROVED";
  status: any[] = [
    // { value: "PENDING" },
    { value: "APPROVED" },
    { value: "REJECTED" },
  ];
  currentDateTime: string;

  constructor(
    public router: Router,
    private orderService: OrdersService,
    private spinner: NgxSpinnerService,
  ) { }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  onSelect(data: string) {
    switch (data) {
      case "PENDING":
        this.getStatus = "PENDING";
        break;
      case "REJECTED":
        this.getStatus = "REJECTED";
        break;
      default:
        this.getStatus = "APPROVED";
    };
    this.searchTerm = '';
    this.loadData();
  }

  viewCall(row) {

    this.orderService.getOrderById(row.orderId).subscribe((res) => {
      this.itemList = res.data
      this.totalPrice();
    });
    this.hide = true;
    this.customerName = row.customer
    window.scroll({ top: 0, left: 0, behavior: "smooth" });

  }

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_PendingOrder_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR PendingOrder Details", 15, 25);

    autoTable(doc,
      {
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
      }
    );
    doc.save("KPR_PendingOrder_Details_" + this.currentDateTime);
  }


  totalPrice() {
    this.total = 0;
    for (let data of this.itemList) {
      this.total += data.unitPrice * (data.unitOfMeasure.unitWeight * data.orderedQuantity);
    }
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

  search(){
    this.paginator.firstPage();
    this.loadData();
  }

  public loadData() {

    this.loading = false

    this.orderService
      .getOrderStatusList(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.searchTerm,
        this.getStatus
      )
      .subscribe((response: any) => {
        ;
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });

  }
}
