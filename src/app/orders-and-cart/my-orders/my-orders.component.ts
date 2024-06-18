import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { HttpClient } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { OrdersService } from 'app/core/service/orders/orders.service';
import { AuthService } from 'app/core/service/auth.service';
import { sort } from 'app/core/models/sort';
import { SharedService } from 'app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  displayedColumns = [
    'orderId',
    // 'orderedQuantity',
    'orderStatus',
    'actions'
  ];
  displayedColumns1 = [
    'orderId',
    // 'orderedQuantity',
    'orderStatus',
    'updatedAt'
  ];
  displayedColumns2 = [
    'orderId',
    // 'orderedQuantity',
    'orderStatus',
    'updatedAt',
    'rejectReason'
  ];
  dataSource:any;
  hideDelete = false;
  hideList = false;
  hide = false;
  data : any;
  userId: number;
  orderId: number;
  orderStatus: string;
  searchTerm: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  itemList: any = [];
  total = null;
  deleteItem = {
    id: 0,
    key: ''
  };
  getStatus = "APPROVED";
  status: any[] = [
    { value: "PENDING" },
    { value: "APPROVED" },
    { value: "REJECTED" },
  ];

  constructor(
    public httpClient: HttpClient,
    public router: Router,
    private authService : AuthService,
    public dialog: MatDialog,
    private orderService: OrdersService,
    private shared: SharedService,
    private notification: NotificationsComponent,
  ) {
    this.userId = authService.currentUserValue.userId
    if(shared.orderStatus){
      this.viewCall(shared.orderStatus);
    } 
  }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  viewCall(row) { 
    this.orderService.getOrderStatusById(row.orderId).subscribe((res) => {
      if(res){
        this.itemList = res.data
        if(this.itemList.length !=0){
        this.orderStatus = this.itemList[0].order.orderStatus;
      }
      this.totalPrice();
      }
    });
    this.hideList = true;
    this.orderId = row.orderId;
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }

  totalPrice() {
    this.total = 0;
    for (let data of this.itemList) {
      this.total += data.unitPrice * (data.unitOfMeasure.unitWeight * data.orderedQuantity);
    }
  }

  deleteCall(row: any) {
    let id = row.orderId
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

  close(){
    this.shared.orderStatus = null;
    this.hideList = false
  }

  cancel() {
    this.hideDelete = false
    this.deleteItem.id = 0;
    this.deleteItem.key = '';
  }

  deleteRow(id) {
    this.orderService.deleteOrder(id).subscribe((res) => {
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
          },
        );
      }
    })
  }

  onSelect(data){
    this.getStatus = data;
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

  public loadData() {
    this.hideDelete = false
    this.orderService.getOrderByCustomer(
      this.userId,
      this.pageIndex,
      this.pageSize,
      this.sortEvent.active,
      this.sortEvent.direction.toUpperCase(),
      this.searchTerm,
      this.getStatus,
    ).subscribe((response: any) => {
      this.data = response.data;
      this.dataSource = this.data.content;
      this.pageIndex = 0;
    })
  }
}
