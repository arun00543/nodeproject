import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { BillingService } from "app/core/service/billing/billing.service";
import { OrdersService } from "app/core/service/orders/orders.service";
import { sort } from "app/core/models/sort";
import { AuthService } from "app/core/service/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MatTableExporterDirective, ExportType } from "mat-table-exporter";
import { SharedService } from "app/shared/shared.service";
import { Router } from "@angular/router";
import { IndCurrencyFormat } from "app/core/custom/pipe/currencyPipe";

@Component({
  selector: "app-payment-status",
  templateUrl: "./payment-status.component.html",
  styleUrls: ["./payment-status.component.scss"],
})
export class PaymentStatusComponent implements OnInit {
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
    // 'select',
    // "index",
    "salesId",
    "customerName",
    // "paymentStatus",
    "totalOrderAmount",
    "totalPaidAmount",
    "paymentDate",
    //"actions",
  ];
  displayedColumns2 = [
    "salesId",
    // "paymentStatus",
    "totalOrderAmount",
    "totalPaidAmount",
    "paymentDate",
  ];
  dataSource: any;
  data: any;
  searchName:  any = "";
  searchTerm: any = "";
  fromDate: string = "";
  toDate: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  searchField: string = "saleId";
  itemList: any;
  hide = false;
  customerName: string;
  getStatus = "UNPAID";
  status: any[] = [
    { value: "UNPAID" },
    { value: "PARTIAL" },
    { value: "PAID" },
    { value: "CREDIT" },
  ];
  searchType = [
    { key: "Sale Id", value: "saleId" },
    { key: "Customer", value: "customer" },
  ]
  userId: number;
  userRole: string;

  constructor(
    private orderService: OrdersService,
    private billingService: BillingService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private shared: SharedService,
    public router: Router,
  ) {
    this.userId = authService.currentUserValue.userId;
    this.userRole = authService.currentUserValue.role;
  }

  refresh() {
    this.searchTerm = '';
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  onSelect(data: string) {
    switch (data) {
      case "PARTIAL":
        this.getStatus = "PARTIAL";
        break;
      case "PAID":
        this.getStatus = "PAID";
        break;
      case "REFUNDED":
        this.getStatus = "REFUNDED";
        break;
      case "CREDIT":
        this.getStatus = "CREDIT";
        break;
      default:
        this.getStatus = "UNPAID";
    };
    this.refresh();
  }

  viewCall(row) {
    this.billingService.getViewPaymentBySalesId(row.salesId).subscribe((res) => {
      if(res){
        this.itemList = res.data;
        this.hide = true;
        this.customerName = row.customerName;
      }
    });
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }

  currentDateTime = this.datepipe.transform(new Date(), "MM-dd-yyyy h-mm-ss");

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Payment_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Payment Details", 15, 25);

    if (this.userRole != "CUSTOMER") {
      autoTable(doc, {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "SalesId", dataKey: "salesId" },
          { header: "Customer", dataKey: "customerName" },
          { header: "Payment Status", dataKey: "paymentStatus" },
          { header: "Payment Amount", dataKey: "paymentAmount" },
          { header: "Paid Amount", dataKey: "paidAmount" },
          { header: "Payment Date", dataKey: "paymentDate" },
        ],
        didParseCell: function (data) {
          if (data.column.dataKey === "paymentDate") {
            var rawPaymentDate = data.row.raw["paymentDate"];
      
            if (rawPaymentDate) {
              var dateParts = rawPaymentDate.split("T");
              var formattedDate = dateParts.length > 0 ? dateParts[0] : '';
      
              data.cell.text = formattedDate;
            } else {
              data.cell.text = ['-'];
            }
          }
          if (data.column.dataKey === 'paymentAmount') {
            var text;
            if("Payment Amount" != data.row.raw["paymentAmount"]) {
             text = new IndCurrencyFormat().transform(data.row.raw["paymentAmount"]).replace('₹','Rs.');
            } else {
              text = data.row.raw["paymentAmount"]
            }
            if (text && text.length > 0) {
              data.cell.text = text;
            }            
          }
          if (data.column.dataKey === 'paidAmount') {
            var text;
            if("Paid Amount" != data.row.raw["paidAmount"]) {
             text = new IndCurrencyFormat().transform(data.row.raw["paidAmount"]).replace('₹','Rs.');
            } else {
              text = data.row.raw["paidAmount"]
            }
            if (text && text.length > 0) {
              data.cell.text = text;
            }            
          }
        },
      });
    } else {
      autoTable(doc, {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "SalesId", dataKey: "salesId" },
          { header: "Payment Status", dataKey: "paymentStatus" },
          { header: "Payment Amount", dataKey: "paymentAmount" },
          { header: "Paid Amount", dataKey: "paidAmount" },
          { header: "Payment Date", dataKey: "paymentDate" },
        ],
        didParseCell: function (data) {
          if (data.column.dataKey === "paymentDate") {
            var rawPaymentDate = data.row.raw["paymentDate"];
      
            if (rawPaymentDate) {
              var dateParts = rawPaymentDate.split("T");
              var formattedDate = dateParts.length > 0 ? dateParts[0] : '';
      
              data.cell.text = formattedDate;
            } else {
              data.cell.text = ['-'];
            }
          }
          if (data.column.dataKey === 'paymentAmount') {
            var text;
            if("Payment Amount" != data.row.raw["paymentAmount"]) {
             text = new IndCurrencyFormat().transform(data.row.raw["paymentAmount"]).replace('₹','Rs.');
            } else {
              text = data.row.raw["paymentAmount"]
            }
            if (text && text.length > 0) {
              data.cell.text = text;
            }            
          }
          if (data.column.dataKey === 'paidAmount') {
            var text;
            if("Paid Amount" != data.row.raw["paidAmount"]) {
             text = new IndCurrencyFormat().transform(data.row.raw["paidAmount"]).replace('₹','Rs.');
            } else {
              text = data.row.raw["paidAmount"]
            }
            if (text && text.length > 0) {
              data.cell.text = text;
            }            
          }
        },
      });
    }

    doc.save("KPR_Payment_Details_" + this.currentDateTime);
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

  importExport() {
      this.shared.importExportClass = "payStatus";
    this.router.navigate([`/administrative/payment/excel-import-export`]);
  }

  filtercustomerUserId() {
    if (this.userRole != "CUSTOMER") {
      this.billingService
        .getPaymentStatus(
          this.getStatus,
          this.pageIndex,
          this.pageSize,
          this.sortEvent.direction,
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
        .getPaymentCustomerUserId(
          this.userId,
          this.getStatus,
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

  filterSalesId() {
    let id: any = '';
    if (this.userRole === "CUSTOMER") {
      id = this.userId;
    }
    this.billingService
      .getPaymentStatusBySalesId(
        id,
        this.getStatus,
        this.pageIndex,
        this.pageSize,
        this.sortEvent.direction.toUpperCase(),
        this.sortEvent.active,
        this.searchTerm,
        this.searchField,
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
  }


  public loadData() {
    this.filterSalesId();
  }
}
