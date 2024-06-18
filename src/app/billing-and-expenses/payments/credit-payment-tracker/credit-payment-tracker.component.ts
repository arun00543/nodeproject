import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { sort } from "app/core/models/sort";
import { BillingService } from "app/core/service/billing/billing.service";

import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { SharedService } from "app/shared/shared.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MatTableExporterDirective, ExportType } from "mat-table-exporter";
import { IndCurrencyFormat } from "app/core/custom/pipe/currencyPipe";

@Component({
  selector: "app-credit-payment-tracker",
  templateUrl: "./credit-payment-tracker.component.html",
  styleUrls: ["./credit-payment-tracker.component.scss"],
})
export class CreditPaymentTrackerComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  displayedColumns = [
    "customerId.name",
    "salesId",
    "pendingAmount",
    "paidAmount",
    "totalOrderAmount",
    "description",
  ];
  creditTracker: FormGroup;
  dataSource: any;
  hide = false;
  rowDetails: any;
  data: any;
  searchTerm: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  today = new Date();

  constructor(
    private fb: UntypedFormBuilder,
    public router: Router,
    public billingService: BillingService,
    private shared: SharedService,
    public datepipe: DatePipe
  ) {
    let payDetails = shared.generalNotification;
    if (payDetails) {
      setTimeout(()=>{
        this.rowDetails = payDetails.creditPaymentTrack;
        this.hide = true;
    }, 1000);
    }
  }

  ngOnInit() {
    this.loadData();

    this.creditTracker = this.fb.group({
      dueDate: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });
  }

  ngOnDestroy() {
    this.shared.generalNotification = null;
  }

  currentDateTime = this.datepipe.transform(new Date(), "MM-dd-yyyy h-mm-ss");

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Credit_Payment_Tracker_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Credit Payment Tracker Details", 15, 25);

    autoTable(doc, {
      theme: "grid",
      styles: { halign: "center", fillColor: [78, 78, 229] },
      bodyStyles: { fillColor: [235, 235, 238] },
      margin: { top: 40 },
      body: data,
      columns: [
        { header: "Customer Id", dataKey: "customerId" },
        { header: "Sales id ", dataKey: "salesId" },
        { header: "Pending Amount", dataKey: "pendingAmount" },
        { header: "Paid Amount", dataKey: "paidAmount" },
        { header: "Total Order Amount", dataKey: "totalOrderAmount" },
        { header: "Description", dataKey: "description" },
      ],
      didParseCell: function (data) {
        if (data.column.dataKey === "customerId") {
          var text = data.row.raw["customerId"].name;
          if (text && text.length > 0) {
            data.cell.text = text;
          }
        }
        if (data.column.dataKey === 'pendingAmount') {
          var text;
          if("Pending Amount" != data.row.raw["pendingAmount"]) {
           text = new IndCurrencyFormat().transform(data.row.raw["pendingAmount"]).replace('₹','Rs.');
          } else {
            text = data.row.raw["pendingAmount"]
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
        if (data.column.dataKey === 'totalOrderAmount') {
          var text;
          if("Total Order Amount" != data.row.raw["totalOrderAmount"]) {
           text = new IndCurrencyFormat().transform(data.row.raw["totalOrderAmount"]).replace('₹','Rs.');
          } else {
            text = data.row.raw["totalOrderAmount"]
          }
          if (text && text.length > 0) {
            data.cell.text = text;
          }            
        }
      },
    });
    doc.save("KPR_Credit_Payment_Tracker_Details_" + this.currentDateTime);
  }

  viewCall(row) {
    this.rowDetails = row;
    this.creditTracker.controls['dueDate'].setValue(this.rowDetails.dueDate?this.rowDetails.dueDate:"");
    this.creditTracker.controls['description'].setValue(this.rowDetails.description?this.rowDetails.description:"")
    this.hide = true;
  }

  close(){
    this.shared.generalNotification = null;
    this.hide = false
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
    this.rowDetails = "";
    this.hide = false;
    this.billingService
      .getAllCreditPaymentTracker(
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


  update() {
    this.billingService
      .editCreditPaymentTracker(this.rowDetails.id, this.creditTracker.value)
      .subscribe((res) => {
        this.loadData();
        if(res.status === "OK"){
          this.shared.generalNotification = null;
        }
      });
  }
}
