import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { sort } from 'app/core/models/sort';
import { AuthService } from 'app/core/service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from "@angular/common";
import { ExportType, MatTableExporterDirective } from 'mat-table-exporter';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-manage-daily-status',
  templateUrl: './manage-daily-status.component.html',
  styleUrls: ['./manage-daily-status.component.scss']
})
export class ManageDailyStatusComponent_A implements OnInit {

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
    'employee.name',
    'date',
    'notes',
    // 'actions',
  ];
  dataSource: any;
  status: any;
  selection = new SelectionModel<any>(true, []);
  rows = [];
  loading = false;
  hideStatusDetails = false;
  userDetails: any;
  data: any;
  today = new Date();
  filteredData = [];
  selectedOption: string;
  searchTerm: string = "";
  fromDate: string = "";
  toDate: string = "";
  sortEvent: sort = {
    active: "date",
    direction: "DESC"
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  id: number;
  userRole: string;
  isLoading = true;
  deleteItem = {
    id: 0,
    key: ''
  };


  constructor(
    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    public router: Router,
    public datepipe: DatePipe,
    private userService: UserService,
    public dialog: MatDialog,
    private authService: AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.userRole = authService.currentUserValue.role
  }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

    editCall(row) {
    this.shared.toEdit = row.id;
    this.router.navigate([`/admin/edit-daily-status`]);
  }

  viewCall(row) {
    this.hideStatusDetails = true;
    this.userService.getDailyStatusById(row.id).subscribe((res) => {
      this.status = res.data
    });
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }

  deleteCall(row: any) {
    let name = row.employee
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
    
    this.userService.deleteDailyStatus(id).subscribe((res: any) => {
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
      fileName: "KPR_DailyStatus_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR DailyStatus Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Employee", dataKey: "employee" },
          { header: "Date", dataKey: "date" },
          { header: "Notes", dataKey: "notes" },
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
    doc.save("KPR_DailyStatus_" + this.currentDateTime);
  }

  sortData(event: Sort) {
    this.sortEvent = event;
    this.sort.disableClear = true;
    this.paginator.firstPage();
    this.loadData();
  }

  getPage(event: PageEvent) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.loadData();
  }

  search(){
    this.paginator.firstPage()
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
    this.userService.getDailyStatus(this.pageIndex, this.pageSize, this.sortEvent.active, this.sortEvent.direction.toUpperCase(), this.searchTerm, (this.fromDate ? this.convert(this.fromDate) : ""), (this.toDate ? this.convert(this.toDate) : "")).subscribe((response: any) => {
      this.data = response.data;
      this.dataSource = this.data.content
      this.pageIndex = 0
    })
    
  }

}

