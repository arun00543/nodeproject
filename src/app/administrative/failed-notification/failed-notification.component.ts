import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { sort } from 'app/core/models/sort';
import { AdministrativeService } from 'app/core/service/administrative/administrative.service';
import { MatTableExporterDirective } from 'mat-table-exporter';

@Component({
  selector: 'app-failed-notification',
  templateUrl: './failed-notification.component.html',
  styleUrls: ['./failed-notification.component.scss']
})
export class FailedNotificationComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  displayedColumns = [
    'select',
    "title",
    "message",
    "phoneNumber",
    "actions",
  ];
   dataSource =[];
  selection = new SelectionModel<any>(true, []);
  activateIds = []
  data: any;
  currentUser: any;
  searchTerm: string = "";
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
    public administrativeService: AdministrativeService,
    private notification: NotificationsComponent,
    public dialog: MatDialog,
    public datepipe: DatePipe
  ) {
  }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  editCall(row?) {
    this.activateIds = []
    if(row){
      this.activateIds.push(row.id)
    } else {
      this.selection.selected.forEach((row)=>{
        this.activateIds.push(row.id)
      })
    }
    this.administrativeService.resendNotification(this.activateIds).subscribe((res:any) => {
        let message;
        if (res.status === "OK") {
          this.activateIds = []
      this.loadData();
        this.notification.showNotification(
          "top",
          "right",
          (message = {
            message: res.message,
            status: "success",
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

  deleteCall(row: any) {
    let name = row.username;
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.removeSelectedRows()
      : this.dataSource.forEach((row) => {
        this.selection.select(row);
        });
  }

  removeSelectedRows(){
    this.selection.clear();
  }


  cancel() {
    this.deleteItem.id = 0;
    this.deleteItem.key = "";
  }

  deleteRow(id) {
    this.administrativeService.deleteNotification(id).subscribe((res: any) => {
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

  sortData(event: Sort) {
    this.sortEvent = event;
    this.sort.disableClear = true;
    this.paginator.firstPage();
    this.loadData();
    this.removeSelectedRows()
  }

  getPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadData();
    this.masterToggle();
    this.removeSelectedRows();
  }

  search(){
    this.paginator.firstPage();
    this.loadData();
  }

  public loadData() {
    this.administrativeService
      .getNotificationList(
         this.pageIndex,
         this.pageSize,
         this.sortEvent.active,
        this.sortEvent.direction.toUpperCase()
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
  }
}