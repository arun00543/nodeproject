import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";

import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { OrdersService } from "app/core/service/orders/orders.service";
import { sort } from "app/core/models/sort";
import { BillingService } from "app/core/service/billing/billing.service";
import { AuthService } from "app/core/service/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MatTableExporterDirective, ExportType } from "mat-table-exporter";

@Component({
  selector: "app-manage-sales-order",
  templateUrl: "./manage-sales-order.component.html",
  styleUrls: ["./manage-sales-order.component.scss"],
})
export class ManageSalesOrderComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  displayedColumns = [
    "salesId",
    "customerName",
    "paymentStatus",
  ];
  displayedColumns2 = [
    "salesId",
    "paymentStatus",
  ];
  dataSource: any;
  data: any;
  searchTerm: string = "";
  searchField: string = "saleId";
  fromDate: string = "";
  toDate: string = "";
  getStatus = "UNPAID";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  itemList: any;
  total = null;
  hide = false;
  customerName: string ="";
  saleId: number;
  userId: number;
  userRole: string;
  currentDateTime: string;
  searchType = [
    { key: "Sale Id", value: "saleId" },
    { key: "Customer", value: "customer" },
  ]

  constructor(
    private orderService: OrdersService,
    private authService: AuthService,
    private billingService: BillingService,
    private spinner: NgxSpinnerService,
  ) {
    this.userId = authService.currentUserValue.userId;
    this.userRole = authService.currentUserValue.role;
  }

  refresh() {
    this.searchTerm='';
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  viewCall(row) {
    this.saleId = row.salesId;
    this.orderService.getOrderBySalesId(this.saleId).subscribe((res) => {
      this.itemList = res.data;
      this.totalPrice();
    });
    this.hide = true;
    this.customerName = row.customerName;
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }
 
  totalPrice() {
    this.total = 0;
    for (let data of this.itemList) {
      this.total +=
        data.unitPrice * (data.unitOfMeasure.unitWeight * data.orderedQuantity);
    }
  }

  downloadInvoice(id: any) {
    
    this.billingService.getPDF(id).subscribe((response) => {
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(
        new Blob([response.body], { type: response.body.type })
      );
      downloadLink.download = "KPR_SALES_INVOICE_"+id;
      downloadLink.click();
      // downloadLink.remove();
    });
    
  }

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Sales-Invoice_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Sales-Invoice Details", 15, 25);

    if(this.userRole != "CUSTOMER"){
    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Sales Id", dataKey: "salesId" },
          { header: "Customer Name ", dataKey: "customerName" },
          { header: "Payment Status", dataKey: "paymentStatus" },
                   
        ],
      }
    );
    }
    else{
      autoTable(doc,
        {
          theme: "grid",
          styles: { halign: "center", fillColor: [78, 78, 229] },
          bodyStyles: { fillColor: [235, 235, 238] },
          margin: { top: 40 },
          body: data,
          columns: [
            { header: "Sales Id", dataKey: "salesId" },
            { header: "Payment Status", dataKey: "paymentStatus" },                   
          ],
        }
      );

    }
    doc.save("KPR_Sales-Invoice_Details_" + this.currentDateTime);
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
  
filterSalesId(){
  this.saleId = null;
  if (this.userRole != "CUSTOMER") {
    this.billingService
      .getPaymentinvoiceBySalesId(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.direction.toUpperCase(),
        this.sortEvent.active,
        this.searchTerm
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
      
  } else {

    this.billingService
      .getPaymentCustinvoiceBySalesId(
        this.userId,
        this.pageIndex,
        this.pageSize,
        this.sortEvent.direction.toUpperCase(), 
        this.sortEvent.active,
        this.searchTerm
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
      
  }

}
filterCustomerId(){
  this.saleId = null;
    if (this.userRole != "CUSTOMER") {
      this.billingService
        .getPaymentinvoice(
          this.pageIndex,
          this.pageSize,
          this.sortEvent.direction.toUpperCase(),
          this.sortEvent.active,
          this.searchTerm
        )
        .subscribe((response: any) => {
          this.data = response.data;
          this.dataSource = this.data.content;
          this.pageIndex = 0;
        });
        
    } else {
      this.billingService
        .getPaymentinvoiceCustomer(
          this.userId,
          this.pageIndex,
          this.pageSize,
          this.sortEvent.direction.toUpperCase(), 
          this.sortEvent.active,
          this.searchTerm
        )
        .subscribe((response: any) => {
          this.data = response.data;
          this.dataSource = this.data.content;
          this.pageIndex = 0;
        });
        
    }
}

  public loadData() {
    if(this.searchField === 'saleId'){
      this.filterSalesId();
    } else{
      this.filterCustomerId();
    }
  }
}
