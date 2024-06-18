import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { sort } from 'app/core/models/sort';
import { AdministrativeService } from 'app/core/service/administrative/administrative.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-manage-alert-content',
  templateUrl: './manage-alert-content.component.html',
  styleUrls: ['./manage-alert-content.component.scss']
})
export class ManageAlertContentComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  public focus;
  displayedColumns = [
    // 'select',
    // "index",
  'rejectReason',
  'actions',
  ];
  dataSource: any;
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
  reasonService: any;

  constructor(
    public router: Router,
    private notification: NotificationsComponent,
    public dialog: MatDialog,
    private shared: SharedService,
    private administrativeService: AdministrativeService,
    public datepipe:DatePipe

  ) { }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }


    editCall(row) {
  this.shared.toEdit = row.id;
    this.router.navigate([`/administrative/edit-leave-reject-reason`]);
  }

  deleteCall(row: any) {
    let id = row.id
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message : "Delete",
        id: id
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteRow(id);
      } 
    });
  }

  cancel() {
    this.deleteItem.id = 0;
    this.deleteItem.key = '';
  }

  deleteRow(id) {
    this.administrativeService.deleteLeaveRejectReason(id).subscribe((res) => {

      this.loadData();
      if (res.status === "OK") {
        let message;
        this.notification.showNotification(
          'top',
          'center',
          message = {
            "message": res.message,
            "status": "success"
          },
        );
      }
      else {
        let message;
        this.notification.showNotification(
          'top',
          'center',
          message = {
            "message": res.message,
            "status": "danger"
          },
        );
      }
    })
  }

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );


  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Rejected_Reason_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Rejected Details Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Rejected Reason", dataKey: "rejectReason" },
          
          

        ],
      }
    );
    doc.save("KPR_Rejected_Reason_Details_" + this.currentDateTime);
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
    this.administrativeService.getLeaveRejectReason().subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data;
        this.pageIndex = 0;
      });
  }
}

