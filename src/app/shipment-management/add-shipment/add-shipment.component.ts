import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { sort } from 'app/core/models/sort';
import { ShipmentService } from 'app/core/service/shipment/shipment.service';
import { DatePipe } from "@angular/common";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';
import { SharedService } from 'app/shared/shared.service';



@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.scss']
})
export class AddShipmentComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  displayedColumns = [
    'salesId',
    'name',
    //'shipmentDate',
    "shipmentStatus",
  ];

  dataSource: any;
  loading = false;
  data: any;
  searchTerm: string = "";
  sortEvent: sort = {
    active: "salesId",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  searchField: string = "saleId";
  searchType = [
    { key: "Sale Id", value: "saleId" },
    { key: "Customer", value: "customer" },
  ]

  constructor(
    public router: Router,
    public shipmentService: ShipmentService,
    private shared: SharedService,
    public datepipe: DatePipe
  ) { }

  refresh() {
    this.searchTerm = '';
    this.loadData();
  }

  ngOnInit(): void {
    this.loadData();
  }

  editCall(row) {
    this.shared.toEdit = row.salesId;
    this.router.navigate([`/shipment/edit-shipment/update-shipment`]);
  }

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );


  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Shipment_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Shipment Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Customer Name", dataKey: "name" },
          { header: "Sales id ", dataKey: "salesId" },
          { header: "Shipment Status", dataKey: "shipmentStatus" },

        ],
      }
    );
    doc.save("KPR_Shipment_Details_" + this.currentDateTime);
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
    this.loading = true;
    this.shipmentService
      .getShipmentListingBySalesId(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.direction.toUpperCase(),
        this.sortEvent.active,
        this.searchTerm
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
      });
  }

  filterCustomerId() {
    this.loading = true;
    this.shipmentService
      .getShipmentListingWithCustomer(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.direction.toUpperCase(),
        this.sortEvent.active,
        this.searchTerm
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
      });
  }

  public loadData() {
    if (this.searchField === 'saleId') {
      this.filterSalesId();
    } else {
      this.filterCustomerId();
    }
  }
}
