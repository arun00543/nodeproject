import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { UserService } from "app/core/service/user.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { sort } from "app/core/models/sort";
import { AuthService } from "app/core/service/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationDialogComponent } from "app/additional-components/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-manage-daily-status",
  templateUrl: "./manage-daily-status-u.component.html",
  styleUrls: ["./manage-daily-status-u.component.scss"],
})
export class ManageDailyStatusComponent_U implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
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
    //'employee',
    "date",
    "notes",
    "actions",
  ];
  dataSource: any;
  loading = false;
  data: any;
  today = new Date();
  searchTerm: string = "";
  fromDate: string = "";
  toDate: string = "";
  sortEvent: sort = {
    active: "date",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  userId: number;
  deleteItem = {
    id: 0,
    key: "",
  };

  constructor(
    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) { }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

    editCall(row) {
  this.shared.toEdit = row.id;
    this.router.navigate([`/employee/edit-daily-status`]);
  }

  deleteCall(row: any) {
    let name = row.employee.name
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
    this.deleteItem.key = "";
  }

  deleteRow(id) {
    
    this.userService
      .deleteDailyStatus(id)
      .subscribe((res: any) => {
        this.loadData();
        if (res.status === "NO_CONTENT") {
          let message;
          this.notification.showNotification(
            "top",
            "right",
            (message = {
              message: res.message,
              status: "danger",
            })
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
            });
          
        }
      });
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
    this.userId = this.authService.currentUserValue.userId;
    this.userService
      .getDailyStatusByUserId(
        this.userId,
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.fromDate ? this.convert(this.fromDate) : "",
        this.toDate ? this.convert(this.toDate) : ""
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
    
  }
}
