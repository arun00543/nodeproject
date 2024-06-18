import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { sort } from 'app/core/models/sort';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Validators } from 'ngx-editor';

@Component({
  selector: 'app-manage-swipe-entry',
  templateUrl: './manage-swipe-entry.component.html',
  styleUrls: ['./manage-swipe-entry.component.scss']
})
export class ManageSwipeEntryComponent implements OnInit {

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
    "employee.name",
    "swipeDate",
    // "swipeType",
    "actions",
  ];

  dataSource: any;
  loading = false;
  data: any;
  fromDate: any;
  toDate: any;
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
    private fb: UntypedFormBuilder,
    public router: Router,
    public userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    public dialog: MatDialog,
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
    this.router.navigate([`/employee/edit-swipe-entry`]);
  }

  deleteCall(row: any) {
    let name = row.employee.name
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: "Delete",
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

    this.userService.deleteSwipeEntry(id).subscribe((res: any) => {

      this.loadData();
      if (res.status === "NO_CONTENT") {
        let message;
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
        let message;
        this.notification.showNotification(
          'top',
          'right',
          message = {
            "message": res.message,
            "status": "warning"
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
      fileName: "KPR_Attendance_Swipe_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Attendance Swipe", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Employee", dataKey: "employee" },
          { header: "Swipe Date", dataKey: "swipeDate" },

        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'employee') {
            var text = data.row.raw["employee"].name;
            if (text && text.length > 0) {
              data.cell.text = text;
            }

          }
        }
      }
    );
    doc.save("KPR_Attendance_Swipe_" + this.currentDateTime);
  }

  sortData(event: Sort) {
    this.sortEvent = event;
    this.sort.disableClear = true;
    this.loadData();
  }

  getPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
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
    this.userService
      .getSwipeEntryList(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.searchTerm,
        this.fromDate ? this.convert(this.fromDate) : '',
        this.toDate ? this.convert(this.toDate) : ''
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });

  }

}

