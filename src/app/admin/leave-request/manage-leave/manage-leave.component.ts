import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import {
  UntypedFormBuilder,
  Validators,
  FormGroup,
} from "@angular/forms";
import { SelectionModel } from "@angular/cdk/collections";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { UserService } from "app/core/service/user.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { sort } from "app/core/models/sort";
import { AuthService } from "app/core/service/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ExportType, MatTableExporterDirective } from "mat-table-exporter";
import { DatePipe } from "@angular/common";
import { OrdersService } from "app/core/service/orders/orders.service";


@Component({
  selector: "app-manage-leave",
  templateUrl: "./manage-leave.component.html",
  styleUrls: ["./manage-leave.component.scss"],
})
export class ManageLeaveComponent_A implements OnInit {
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
    // // "index",
    "employee.name",
    "leaveType",
    "startDate",
    "endDate",
    "duration",
    "employeeLeaveStatus",
    "actions",
  ];
  dataSource: any;
  addEmployeeleave: FormGroup;
  loading = false;
  hideDeleteDialog = false;
  hideDetailDialog = false;
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
  currentUser: any;
  currentUserId: number;
  error = false;
  today = new Date();
  rise = false;
  reject = false;
  rejectBtn = true;
  userRole: string;
  rejectReason : any;
  deleteItem = {
    id: 0,
    key: "",
  };

  constructor(
    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    public router: Router,
    private authService: AuthService,
    private userService: UserService,
    private orderService: OrdersService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
  ) {
    this.currentUser = authService.currentUserValue.userId;
    this.currentUserId = parseInt(authService.currentUserValue.userName);
    this.userRole = authService.currentUserValue.role;
  }

  refresh() {
    this.loadData();

  }

  ngOnInit() {
    this.loadData();

    this.addEmployeeleave = this.fb.group({
      id: [],
      employee: ["", [Validators.required]],
      leaveType: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      compensationDate: ["", [Validators.required]],
      duration: ["", [Validators.required]],
      reason: ["", [Validators.required]],
      rejectReason: ["", [Validators.required]],
      employeeLeaveStatus: [""],
      updatedBy: [this.currentUser],
    });
    
  }

  //   editCall(row) {
  //   this.shared.toEdit = row.id;
  //   this.router.navigate([`/admin/edit-leave-request`]);
  // }

  deleteCall(row: any) {
    this.deleteItem.id = row.id;
    this.deleteItem.key = row.employeeIded;
    this.hideDeleteDialog = true;
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }

  cancel() {
    this.hideDeleteDialog = false;
    this.hideDetailDialog = false;
    this.addEmployeeleave.reset();
    this.deleteItem.id = 0;
    this.deleteItem.key = "";
  }
  

  actionCall(action: string) {
    if (action != "reject") {
      this.reject = false;
      this.rejectBtn = true;
      this.approveRequest();
    } else {
      this.reject = true;
      this.rejectBtn = false;
    }
    this.rise = true;
  }

  approveRequest() {
    
    this.addEmployeeleave.controls["employeeLeaveStatus"].setValue("APPROVED");
    this.userService
      .editLeave(this.addEmployeeleave.value.id, this.addEmployeeleave.value)
      .subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.hideDetailDialog = false;
          this.addEmployeeleave.reset();
          this.notification.showNotification(
            "top",
            "right",
            (message = {
              message: data.message,
              status: "info",
            })
          );
          this.loadData();
          
        }
        else {
          let message;
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "warning"
            },
          );
          
        }
      });
  }

  rejectRequest() {
    
    this.addEmployeeleave.controls["employeeLeaveStatus"].setValue("REJECTED");
    this.userService
      .editLeave(this.addEmployeeleave.value.id, this.addEmployeeleave.value)
      .subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.hideDetailDialog = false;
          this.addEmployeeleave.reset();
          this.notification.showNotification(
            "top",
            "right",
            (message = {
              message: data.message,
              status: "info",
            })
          );
          this.loadData();
          
        } else {
          let message;
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "warning"
            },
          );
          
        }
      });
  }

  close(){
    this.reject = false;
    this.rejectBtn = true;
    this.rise = false;
    this.hideDetailDialog = false;
  }

  viewCall(row) {
    
    this.userService.getLeaveById(row.id).subscribe((res) => {
      let data = res.data;
      if (res.status === "OK") {
        this.addEmployeeleave.controls["id"].setValue(data.id);
        this.addEmployeeleave.controls["employee"].setValue(data.employee);
        this.addEmployeeleave.controls["leaveType"].setValue(data.leaveType);
        this.addEmployeeleave.controls["startDate"].setValue(data.startDate);
        this.addEmployeeleave.controls["endDate"].setValue(data.endDate);
        this.addEmployeeleave.controls["compensationDate"].setValue(data.compensationDate);
        this.addEmployeeleave.controls["duration"].setValue(data.duration);
        this.addEmployeeleave.controls["reason"].setValue(data.reason);
        this.addEmployeeleave.controls["employeeLeaveStatus"].setValue(
          data.employeeLeaveStatus
        );
      }
    });
    this.hideDetailDialog = true;
    
  }

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );


  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_LeaveRequest_Details" + this.currentDateTime,
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
    doc.save("KPR_LeaveRequest_Details" + this.currentDateTime);
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
    this.userService
      .getLeaveRequestByStatus(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.searchTerm,
        this.fromDate ? this.convert(this.fromDate) : "",
        this.toDate ? this.convert(this.toDate) : "",
        "PENDING"
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
        this.close();
        
      });

      this.orderService
      .getReason('LeaveRejection')
      .subscribe((response: any) => {
        this.rejectReason = response.data;
      });
  }
  
}
