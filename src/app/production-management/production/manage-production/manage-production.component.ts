import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { UnsubscribeOnDestroyAdapter } from "app/shared/UnsubscribeOnDestroyAdapter";
import { ExampleDataSource } from "app/shared/short&filterTable";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { SharedService } from "app/shared/shared.service";
import { ProductionService } from "app/core/service/Production/production.service";
import { ExportType, MatTableExporterDirective } from "mat-table-exporter";
import { sort } from "app/core/models/sort";
import { DatePipe } from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationDialogComponent } from "app/additional-components/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-manage-production",
  templateUrl: "./manage-production.component.html",
  styleUrls: ["./manage-production.component.scss"],
})
export class ManageProductionComponent implements OnInit {
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
    "itemMaster.brand.name",
    "itemMaster.itemName",
    "startDate",
    "endDate",
    "actions",
  ];
  dataSource: any;
  data: any;
  searchTerm: string = "";
  loading = false;
  error = false;
  fromDate: string = "";
  toDate: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  deleteItem = {
    id: 0,
    key: "",
  };

  constructor(
    public router: Router,
    private productionService: ProductionService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public datepipe: DatePipe
  ) {}

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  // editCall(row) {
  //   this.shared.toEdit = row.id;
  //   this.router.navigate([`/production/edit-production`]);
  // }

  deleteCall(row: any) {
    let name = row.itemMaster?.itemName;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: "Delete",
        id: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteRow(row.id);
      }
    });
  }

  cancel() {
    this.deleteItem.id = 0;
    this.deleteItem.key = "";
  }

  deleteRow(id) {
    this.productionService.deleteProduction(id).subscribe((res) => {
      this.loadData();
        let message;
        if (res.status === "NO_CONTENT") {
        this.notification.showNotification(
          "top",
          "right",
          (message = {
            message: res.message,
            status: "danger",
          })
        );
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

  currentDateTime = this.datepipe.transform(new Date(), "MM-dd-yyyy h-mm-ss");

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Production_Management_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Production Maintenance", 15, 25);

    autoTable(doc, {
      theme: "grid",
      styles: { halign: "center", fillColor: [78, 78, 229] },
      bodyStyles: { fillColor: [235, 235, 238] },
      margin: { top: 40 },
      body: data,
      columns: [
        { header: "Item Name", dataKey: "itemMaster" },
        { header: "Status", dataKey: "status" },
        { header: "Start Date", dataKey: "startDate" },
        { header: "End Date", dataKey: "endDate" },
      ],
      didParseCell: function (data) {
        if (data.column.dataKey === "itemMaster") {
          var text = data.row.raw["itemMaster"].itemName;
          if (text && text.length > 0) {
            data.cell.text = text;
          }
        }
      },
    });
    doc.save("KPR_Production_Management_" + this.currentDateTime);
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

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  public loadData() {
    this.loading = true;
    this.error = false;
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.error = true;
    }
    this.productionService
      .getProductionList(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.searchTerm,
        this.fromDate ? this.convert(this.fromDate) : "",
        this.toDate ? this.convert(this.toDate) : "",
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
  }
}
