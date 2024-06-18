
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { InventoryService } from "app/core/service/inventory/inventory.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { sort } from "app/core/models/sort";
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import jsPDF from "jspdf";
import { MatTableExporterDirective, ExportType } from "mat-table-exporter";
import autoTable from "jspdf-autotable";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "app/additional-components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-manage-units',
  templateUrl: './manage-units.component.html',
  styleUrls: ['./manage-units.component.scss']
})
export class ManageUnitsComponent implements OnInit {

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
    // "id",
    // "index",
    "unitName",
    "unitDescription",
    "unitWeight",
    "actions"
  ];

  dataSource: any;
  loading = false;
  data: any;
  searchTerm: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  deleteItem = {
    id: 0,
    key: ''
  };

  constructor(
    public router: Router,
    public inventoryService: InventoryService,
    public notification: NotificationsComponent,
    private shared: SharedService,
    public dialog :MatDialog,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe

  ) { }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

    editCall(row) {
  this.shared.toEdit = row.id;
    this.router.navigate([`/inventory/edit-units`]);
  }

  deleteCall(row: any) {
    let name = row.unitName
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message : "Delete",
        id: name
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
    this.deleteItem.key = '';
  }

  deleteRow(id) {
    
    this.inventoryService.deleteUnit(id).subscribe((data) => {
      let message;
      if (data.status === "NO_CONTENT") {
        this.notification.showNotification(
          'top',
          'right',
          message = {
            "message": data.message,
            "status": "danger"
          },
        );
        
      } else {
        this.notification.showNotification(
          'top',
          'right',
          message = {
            "message": data.message,
            "status": "warning"
          },
        );
        
      }
      this.loadData();
    })
  }

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );


  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Unit_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Unit Details ", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Unit Name", dataKey: "unitName" },
          { header: "Unit Description", dataKey: "unitDescription" },
          { header: "Unit Weight", dataKey: "unitWeight" }
        ],
      }
    );
    doc.save("KPR_Unit_Details_" + this.currentDateTime);
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
    this.loading = true;
    this.inventoryService
      .getUnitList(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.searchTerm
      )
      .subscribe((response: any) => {
        ;
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
    
  }
}
