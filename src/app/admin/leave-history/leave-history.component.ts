import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { DataSource, SelectionModel } from "@angular/cdk/collections";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { UserService } from "app/core/service/user.service";
import { sort } from "app/core/models/sort";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "app/core/service/auth.service";
import { ExportType, MatTableExporterDirective } from "mat-table-exporter";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatePipe } from "@angular/common";



@Component({
  selector: 'app-leave-history',
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.scss']
})
export class LeaveHistoryComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  public focus;
  displayedColumns = [
    // // "index",
    'employee.name',
    'leaveType',
    'startDate',
    'endDate',
    'duration',
    'employeeLeaveStatus',
    'actions',
  ];
  displayedColumns2 = [
    'leaveType',
    'startDate',
    'endDate',
    'duration',
    'employeeLeaveStatus',
    'actions',
  ];
  dataSource: any;
  hide = false;
  loading = false;
  data: any;
  searchTerm: string = "";
  fromDate: string = "";
  toDate: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  requestDetail: any;
  today = new Date();
  userRole:string;
  userId:number;
  requestId:number;
  getStatus = "APPROVED";
  status: any[] = [
    { value: "PENDING" },
    { value: "APPROVED" },
    { value: "REJECTED" },
  ];
  constructor(
    public httpClient: HttpClient,
    public router: Router,
    private userService: UserService,
    private authService: AuthService,
    public datepipe:DatePipe,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner : NgxSpinnerService
  ) {
    this.userRole = authService.currentUserValue.role;
    if(this.userRole === "EMPLOYEE") {
    this.userId = authService.currentUserValue.userId;
    if(shared.leaveDetail){this.viewCall(shared.leaveDetail)} 
  }
  }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  onSelect(data: string) {
    switch (data) {
      case "PENDING":
        this.getStatus = "PENDING";
        break;
      case "REJECTED":
        this.getStatus = "REJECTED";
        break;
      default:
        this.getStatus = "APPROVED";
    }
    this.loadData();
  }
  
  viewCall(row) { 
    this.userService.changeViewStatus(row.id).subscribe((res) => {
      if(res.status === "OK"){
        this.requestDetail = res.data
      this.hide = true;
      }
    });
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );

  close(){
    this.shared.leaveDetail = null;
    this.hide = false
  }

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Leave_History_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Leave History", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Employee", dataKey: "employee" },
          { header: "Leave Type", dataKey: "leaveType" },
          { header: "Start Date", dataKey: "startDate" },
          { header: "End Date", dataKey: "endDate" },
          { header: "Duration", dataKey: "duration" },
          { header: "EmployeeLeaveStatus", dataKey: "employeeLeaveStatus"},
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
    doc.save("KPR_Leave_History_" + this.currentDateTime);
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
    if(this.userId){
      this.userService
      .getLeaveHistoryByStatus(
        this.userId,
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.searchTerm,
        this.fromDate ? this.convert(this.fromDate) : "",
        this.toDate ? this.convert(this.toDate) : "",
        this.getStatus
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      
    });
    } else {
      this.userService
      .getLeaveRequestByStatus(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.searchTerm,
        this.fromDate ? this.convert(this.fromDate) : "",
        this.toDate ? this.convert(this.toDate) : "",
        this.getStatus
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
    });
    }   
  }
}
