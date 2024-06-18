import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { sort } from 'app/core/models/sort';
import { AuthService } from 'app/core/service/auth.service';
import { ShipmentService } from 'app/core/service/shipment/shipment.service';
import { DatePipe } from "@angular/common";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';



@Component({
  selector: 'app-shipment-status',
  templateUrl: './shipment-status.component.html',
  styleUrls: ['./shipment-status.component.scss']
})
export class ShipmentStatusComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  displayedColumns = [
    "salesId",
    "customerName",
    "shipmentStatus",
    //"shipmentDate",
  ];
  displayedColumns2 = [
    "salesId",
    "shipmentStatus",
   // "shipmentDate",
  ];
  dataSource: any;
  data: any;
  searchTerm: any = '';
  searchField: string = "saleId";
  fromDate: string = "";
  toDate: string = "";
  sortEvent: sort = {
    active: "salesId",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  itemList: any;
  total = null;
  hide = false;
  customerName: string;
  salesId: number;
  getStatus = "PENDING";
  status: any[] = [
    { value: "PENDING" },
    { value: "SHIPPED" },
    { value: "PARTIAL" },
  ];
  searchType = [
    { key: "Sale Id", value: "saleId" },
    { key: "Customer", value: "customer" },
  ]
  userId: number;
  userRole: string;
  statusDetails: any;
  trackId:any;

  constructor(
    private authService: AuthService,
    private shipmentService: ShipmentService,
    public datepipe: DatePipe
  ) {
    this.userId = authService.currentUserValue.userId;
    this.userRole = authService.currentUserValue.role;
  }

  refresh() {
    this.searchTerm ='';
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  onSelect(data: string) {
    switch (data) {
      case "SHIPPED":
        this.getStatus = "SHIPPED";
        break;
      case "PARTIAL":
        this.getStatus = "PARTIAL";
        break;
      default:
        this.getStatus = "PENDING";
    };
    this.refresh();
  }

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );


  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Shipment_Status_Details_" + this.currentDateTime,
    });
  }

  downloadInvoice(trackId : any) {
    this.shipmentService.getPDF(trackId).subscribe((response) => {
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(
        new Blob([response.body], { type: response.body.type })
      );
      downloadLink.download = "KPR_SHIPMENT_TNO_"+trackId;
      downloadLink.click();
    });
  }
  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Shipment Status Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [

          { header: "Sales id ", dataKey: "salesId" },
          { header: "Customer Name", dataKey: "customerName" },
          { header: "Shipment Stauts", dataKey: "shipmentStatus" },
        ],
      }
    );
    doc.save("KPR_Shipment_Status_Details_" + this.currentDateTime);
  }

  viewCall(row) {
    this.hide = true;
    this.shipmentService.getShipmentHistory(row.salesId).subscribe((res) => {
      this.statusDetails = res.data;
    })
    this.customerName = row.customerName;
    this.salesId = row.salesId;
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
  filterSalesId() {
    if (this.userRole != "CUSTOMER") {
      this.shipmentService
        .getShipmentStatusBySalesId(
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
    else {
      this.shipmentService
        .getShipmentUserSaleId(
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
  filterCustomerId() {
    this.hide = false;
    if (this.userRole != "CUSTOMER") {
      this.shipmentService
        .getShipmentStatus(
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
    else {
      this.shipmentService
        .getShipmentUserId(
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


  public loadData() {
    if (this.searchField === 'saleId') {
      this.filterSalesId();
    }
    else {
      this.filterCustomerId();
    }
  }
}