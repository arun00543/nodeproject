import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { sort } from 'app/core/models/sort';
import { AuthService } from 'app/core/service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-manage-leave-request',
  templateUrl: './manage-leave-request.component.html',
  styleUrls: ['./manage-leave-request.component.scss']
})
export class ManageLeaveRequestComponent_U implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  public focus;
  displayedColumns = [

    'leaveType',
    'reason',
    'startDate',
    'endDate',
    'duration',
    'employeeLeaveStatus',
    'actions',
  ];
  dataSource: any;
  loading = false;
  error = false;
  data: any;
  today = new Date();
  searchTerm: string = "";
  fromDate: string = "";
  toDate: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  userId: number;
  deleteItem = {
    id: 0,
    key: ''
  };
  getStatus = "PENDING";
  status: any[] = [
    { value: "PENDING" },
    { value: "APPROVED" },
    { value: "REJECTED" },
  ];
  constructor(
    public router: Router,
    private userService: UserService,
    public dialog:MatDialog,
    private authService: AuthService,
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

    this.router.navigate([`/user/edit-leave-request`]);
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
    this.deleteItem.key = '';
  }

  deleteRow(id) {
    
    this.userService.deleteLeave(id).subscribe((res: any) => {
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
          });
        
      }
    })
  }

  onSelect(data: string) {
    switch (data) {
      case "APPROVED":
        this.getStatus = "APPROVED";
        break;
      case "REJECTED":
        this.getStatus = "REJECTED";
        break;
      default:
        this.getStatus = "PENDING";
    }
    this.loadData();
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
    this.userId = this.authService.currentUserValue.userId;
    this.userService
      .getLeaveRequestById(
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
    
  }


}