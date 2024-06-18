import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { sort } from 'app/core/models/sort';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-contractor',
  templateUrl: './manage-contractor.component.html',
  styleUrls: ['./manage-contractor.component.scss']
})
export class ManageContractorComponent implements OnInit {

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
    "id",
    "name",
    "phoneNumber",
    "contractorType",
    "notes",
    "actions",
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
    public userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    public dialog :MatDialog,
    public datepipe:DatePipe
  ) {
  }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

    editCall(row) {
  this.shared.toEdit = row.id;
    this.router.navigate([`/employee/edit-contractor`]);
  }

  deleteCall(row: any) {
    let name = row.name
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
    this.userService.deleteEmployeeContract(id).subscribe((res: any) => {
      this.loadData();
        let message;
        if (res.status === "NO_CONTENT") {
        this.notification.showNotification(
          'top',
          'right',
          message = {
            "message": res.message,
            "status": "danger"
          },
        );
      }
      else {
        this.notification.showNotification(
          'top',
          'right',
          message = {
            "message": res.message,
            "status": "warning"
          });
      }
    })
  }

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );


  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Contractor_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Contractor Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Contractor Id", dataKey: "id" },
          { header: "Name", dataKey: "name" },
          { header: "Phone Number", dataKey: "phoneNumber" },
          { header: "Contractor Type", dataKey: "contractorType" },
          { header: "Notes", dataKey: "notes" },
        ],
      }
    );
    doc.save("KPR_Contractor_Details_" + this.currentDateTime);
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
    this.userService
      .getEmployeeContractList(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.searchTerm
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
  }

}

 